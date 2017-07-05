var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.get('/qeeg/data', function(req,res,next) {

  var edf, file_duration, i, max, min, my_edf, num_signals, ref, sample_rate, signal_data, signal_index, signal_label, util;

  util = require("util");

  edf = require("../lib/edf");

  my_edf = new edf.EDFFile("./TEST 23_12_15 11_27_06 01.20 to 20.00.rec");

  file_duration = my_edf.get_file_duration();

  num_signals = my_edf.get_header_item("num_signals_in_data_record");

  util.log("The file is " + file_duration + " seconds in length.");

  util.log("There are " + num_signals + " signals in this file.");

  for (signal_index = i = 0, ref = num_signals - 1; 0 <= ref ? i <= ref : i >= ref; signal_index = 0 <= ref ? ++i : --i) {
    signal_label = my_edf.get_signal_item(signal_index, "label");
    sample_rate = my_edf.get_header_item("duration_of_data_record") / my_edf.get_signal_item(signal_index, "num_samples_in_data_record");
    min = my_edf.get_signal_item(signal_index, "physical_min");
    max = my_edf.get_signal_item(signal_index, "physical_max");
    signal_data = my_edf.get_signal_data(signal_index, 0, 1120);
    util.log(signal_label + " has a sampling rate of " + sample_rate + " Hz.");
    util.log(signal_label + " has a min and max of " + min + ": " + max + ".");
    util.log(signal_label + " has data: " + JSON.stringify(signal_data[5]));
  }
  res.status(200).send(signal_data.slice(0,500));
});

module.exports = router;
