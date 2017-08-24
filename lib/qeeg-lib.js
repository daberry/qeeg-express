var FFT = require('fft.js');
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
    //my_edf = new edf.EDFFile("./Russo 21_01_16 14_36_18 00.42 to 20.03.rec");
    my_edf = new edf.EDFFile("./TEST 23_12_15 11_27_06 01.20 to 20.00.rec");
  }
  //
  console.log('using file: ', my_edf);

  file_duration = my_edf.get_file_duration();

  num_signals = my_edf.get_header_item("num_signals_in_data_record");

  util.log("The file is " + file_duration + " seconds in length.");

  util.log("There are " + num_signals + " signals in this file.");

  for (signal_index = i = 0, ref = num_signals - 1; 0 <= ref ? i <= ref : i >= ref; signal_index = 0 <= ref ? ++i : --i) {
    signal_label = my_edf.get_signal_item(signal_index, "label");
    sample_rate = my_edf.get_header_item("duration_of_data_record") / my_edf.get_signal_item(signal_index, "num_samples_in_data_record");
    min = my_edf.get_signal_item(signal_index, "physical_min");
    max = my_edf.get_signal_item(signal_index, "physical_max");
    signal_data = my_edf.get_signal_data(signal_index, 0, file_duration);
    util.log(signal_label + " has a sampling rate of " + 1/sample_rate + " Hz.");
    util.log(signal_label + " has a min and max of " + min + ": " + max + ".");
    util.log(signal_label + " has data: " + JSON.stringify(signal_data.slice(20500,20505).map(function(cur) {
      return '' + cur.time.toFixed(3) +'--_'+ cur.data.toFixed(3);
    })));
    util.log(signal_label + " has " + signal_data.length + " data points in the file.")
    util.log("      OR: " + (signal_data.length / (30 / sample_rate)).toFixed(3) + " total 30 second epochs")
    if (signal_label === "P3-O1") {
      console.log('setting input');
      input = signal_data.slice(20000,22048).map(function(cur) {
        return cur;
      });
    }
  }
  return input;

  //console.log(input.slice(2000,2025));
  var outputlul = new Array(4096);
  f.realTransform(outputlul, input);
  //outputlul = outputlul.slice(0,2048);
  var outObj = {};
  var magnitude, real, imag;
  for (var i = 0; i < 4096; i++) {
    real = outputlul[i * 2] * outputlul[i * 2]
    imag = outputlul[i * 2 + 1] * outputlul[i * 2 + 1]
    magnitude = Math.sqrt(real + imag).toFixed(3);
    if (magnitude > 0) {
      outObj[(i * (100 / 2048)).toFixed(3)] = magnitude;
    }
  }
  return outObj;
  //console.log(outputlul);
}