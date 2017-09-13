var FFT = require('fft.js');
var fs = require('fs');
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
  return ('' + input.slice(1000,5096)).replace(/,/g,'\n');


};

module.exports.fft = (file) => {
  console.log('top of fft');
  if (file) {
    my_edf = fs.readFileSync(file);
  } else {
    my_edf = fs.readFileSync("./russo_data.txt");
    //my_edf = fs.readFileSync("./test_data.txt");
  }
  console.log('68');
  var data = my_edf.toString().split('\n').map(function(curLine, index) {
    return curLine.split(',').map(function(cur)  {
      if (index === 1) {
        console.log(cur)
      }
      return parseFloat(cur).toFixed(3);
    });
  });
  let idx = 1;
  var signal1 = data.map(function(cur) { return cur[idx]; });
  idx = 2;
  var signal2 = data.map(function(cur) { return cur[idx]; });

  let f = new FFT(4096);
  let out = f.createComplexArray();
  let input;

  //var fftOutput = new Array(4096);
  f.realTransform(out, signal1.slice(25000, 29096));
  //fftOutput = fftOutput.slice(0,2048);
  var returnObj = {};
  var magnitude, real, imag;
  console.log('90, data length', data.length, signal1.length);
  for (var i = 0; i < 4096; i++) {
    real = out[i * 2] * out[i * 2]
    imag = out[i * 2 + 1] * out[i * 2 + 1]
    magnitude = Math.sqrt(real + imag).toFixed(3);
    let curFreq = (i * (100 / 2048)).toFixed(3);
    if (magnitude > 0 && curFreq < 100) {
      returnObj[curFreq] = magnitude;
    }
  }
  //console.log('returning output', returnObj);
  //return 'stuff';
  return returnObj;

};