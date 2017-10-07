var FFT = require('fft.js');
var fs = require('fs');
var FFTArray = [];

module.exports.FFTArray = FFTArray;

console.log(FFT);
//var edf-parser
module.exports.qeegParse = (file) =>
{
  var edf, file_duration, i, max, min, my_edf, num_signals, ref, sample_rate, signal_data, signal_index, signal_label,
    util;

  let f = new FFT(4096);
  let input;

  util = require("util");

  edf = require("../lib/edf");
  if (file) {
    my_edf = new edf.EDFFile(file);
  } else {
    my_edf = new edf.EDFFile("./test_r.rec");
    //my_edf = new edf.EDFFile("./test_t.rec");
  }
  //
  //console.log('using file: ', my_edf);

  file_duration = my_edf.get_file_duration();

  num_signals = my_edf.get_header_item("num_signals_in_data_record");

  util.log("The file is " + file_duration + " seconds in length.");

  util.log("There are " + num_signals + " signals in this file.");

  for (signal_index = i = 0, ref = num_signals - 1; 0 <= ref ? i <= ref : i >= ref; signal_index = 0 <= ref ? ++i : --i) {
    signal_label = my_edf.get_signal_item(signal_index, "label");
    sample_rate = my_edf.get_header_item("duration_of_data_record") / my_edf.get_signal_item(signal_index, "num_samples_in_data_record");
    min = my_edf.get_signal_item(signal_index, "physical_min");
    max = my_edf.get_signal_item(signal_index, "physical_max");
    //signal_data = my_edf.get_signal_data(signal_index, 0, 1120);
    signal_data = my_edf.get_signal_data(signal_index, 0, file_duration);
    util.log(signal_label + " has a sampling rate of " + 1/sample_rate + " Hz.");
    util.log(signal_label + " has a min and max of " + min + ": " + max + ".");
    util.log(signal_label + " has data: " + JSON.stringify(signal_data.slice(0,5)));
    util.log(signal_label + " has " + signal_data.length + " data points in the file.")
    util.log("      OR: " + (signal_data.length / (30 / sample_rate)).toFixed(3) + " total 30 second epochs")
    if (signal_label === "P3-O1") {
      console.log('setting input');
      input = signal_data.map(function(cur) {
        return cur.data.toFixed(3);
      });

      //input = signal_data.slice(120000,120100);
    }
  }
  console.log(input.length, (''+input.slice(1000,1642)).replace(/,/g,'\n').length);
  //return
  return ('' + input.slice(1000,5096)).replace(/,/g,'\n');


};







module.exports.fft = (file) => {
  console.log('Performing FFT on all epochs');
  if (file) {
    my_edf = fs.readFileSync(file);
  } else {
    my_edf = fs.readFileSync("./russo_data.txt");
    //my_edf = fs.readFileSync("./test_data.txt");
  }
  console.log('pre epoch size set');
  //check epochSize, set default
  let epochSize = 2048;
  console.log('epochSize: ' + epochSize);

  //parse file and return value rounded to three decimal points
  //each line is returned as ['<time>', 'signal #1', 'signal #2']
  var data = my_edf.toString().split('\n').map(function(curLine, index) {
    return curLine.split(',').map(function(cur)  {
      return parseFloat(cur).toFixed(3);
    });
  });

  //take data from object and place into arrays for each potential
  //DEPRECATED
  /*
  let idx = 1;
  var signal1 = data.map(function(cur) { return cur[idx]; });
  idx = 2;
  var signal2 = data.map(function(cur) { return cur[idx]; });
  */

  //create sum of both leads
  var signalCombined = data.map((cur) => {
    return parseFloat(cur[1]) + parseFloat(cur[2]);
  });

  let f = new FFT(epochSize);
  let out = f.createComplexArray();
  let input;
  FFTArray = [];
  let returnObj = {};
  let startTime = Date.now();
  //grab all fft
  for (let start = 0; start < signalCombined.length - epochSize; start = start + epochSize) {
    returnObj = {};
    //FFT on just P3-O1 potential
    //f.realTransform(out, signal1.slice(start, start + epochSize));

    //FFT on sum of P3-O1 & P4-02 potentials
    f.realTransform(out, signalCombined.slice(start, start + epochSize));

    let magnitude, real, imag;
    //console.log(Date.now() - startTime + ' ms since start | ' + 'current start point: ' + start + ' / ' + signalCombined.length);
    for (var i = 0; i < epochSize; i++) {
      real = out[i * 2] * out[i * 2];
      imag = out[i * 2 + 1] * out[i * 2 + 1];
      magnitude = Math.sqrt(real + imag).toFixed(3);
      let curFreq = (i * (200 / epochSize)).toFixed(3);
      if (magnitude > 0 && curFreq < 100) {
        returnObj[curFreq] = magnitude;
      }
    }
    FFTArray.push(returnObj);
  }


  //console.log('returning output', returnObj);
  //return 'stuff';
  console.log('epochs processed: ', FFTArray.length);
  //
  //var filteredArray =

  return returnObj;

};

//return an array of objects whose keys are within the given frequencies
module.exports.filterEpochs = (low, high) => {
  try{
    console.log('filterEpochs call: low, high, FFTArray length', low, high, FFTArray.length);
    //map all epochs
    let filteredArray = FFTArray.map((cur) => {
      //map individual epoch's FFT
      //console.log('pre filter');
      let parsedKeys = Object.keys(cur).filter((curFreq) => {
        let parsed = parseFloat(curFreq);
        return (parsed >= low && parsed <= high);
      });
      //console.log('post filter: ', parsedKeys.length);
      let result = {};
      for (let i = 0; i < parsedKeys.length; i++) {
        result[parsedKeys[i]] = cur[parsedKeys[i]];
      }
      //filtered result returned to array
      return result;
    });
    console.log('filteredArray size: ', filteredArray.length);
    return filteredArray;
  }
  catch (ex) {
    console.error('error in filterEpochs', ex.message);
  }
};

//returns max point as an array of two numbers
let getMaxPoint = (object) => {
  //assume
  try{
    let keys = Object.keys(object);
    let result = [0, 0];
    keys.forEach(curKey => {
      let parsedKey = parseFloat(curKey);
      let parsedVal = parseFloat(object[curKey]);
      if (parsedVal > result[1]) {
        result = [parsedKey, parsedVal];
      }
    });
    console.log('max is ', result);
    return result;
  }
  catch (e) {
    console.error('error in getMaxPoint', ex, ex.message);
  }
};

module.exports.getMaxPointArray = (inputFFTArray) => {
  let results = [];
  results = inputFFTArray.map(cur => {
    return getMaxPoint(cur);
  });
  return results;
};