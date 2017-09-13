var fs = require('fs');
var file = ("../test_r.rec");

// gain = (physical maximum - physical minimum) / (digital maximum - digital minimum)
// [(physical miniumum) + (digital value in the data record - digital minimum) * gain


  var _header_spec, _signal_spec, _signals;

  _header_spec = [
    {
      "name": "version",
      "length": 8
    }, {
      "name": "patient_id",
      "length": 80
    }, {
      "name": "recording_id",
      "length": 80
    }, {
      "name": "start_date",
      "length": 8
    }, {
      "name": "start_time",
      "length": 8
    }, {
      "name": "number_of_bytes",
      "length": 8
    }, {
      "name": "reserved",
      "length": 44
    }, {
      "name": "num_data_records",
      "length": 8
    }, {
      "name": "duration_of_data_record",
      "length": 8
    }, {
      "name": "num_signals_in_data_record",
      "length": 4
    }
  ];

  _signal_spec = [
    {
      "name": "label",
      "length": 16
    }, {
      "name": "transducer_type",
      "length": 80
    }, {
      "name": "physical_dimensions",
      "length": 8
    }, {
      "name": "physical_min",
      "length": 8
    }, {
      "name": "physical_max",
      "length": 8
    }, {
      "name": "digital_min",
      "length": 8
    }, {
      "name": "digital_max",
      "length": 8
    }, {
      "name": "prefiltering",
      "length": 80
    }, {
      "name": "num_samples_in_data_record",
      "length": 8
    }
  ];

  _signals = [];

  function EDFFile(edf_path) {
    var _specs, i, j, l, len, ref, spec;

    this.edf_path = edf_path;
    if (!fs.existsSync(this.edf_path)) {
      throw Error("Invalid path specified: " + this.edf_path);
    }
    this._handle = fs.openSync(this.edf_path, "r");
    this._header_item = {};
    this._signal_item = {};
    var signalCount = parseInt(this.get_header_item("num_signals_in_data_record"));
    for (i = 0; i < signalCount; i++) {
      console.log(i);
      _specs = {};
      for (l = 0, len = _signal_spec.length; l < len; l++) {
        spec = _signal_spec[l];
        _specs[spec.name] = this.get_signal_item(i, spec.name);
      }
      _signals.push(_specs);
      //console.log('# signals @ constructor: ', _signals.length);
    }
  };

  EDFFile.prototype.get_header_offset = function() {
    return 256 + (this.get_header_item("num_signals_in_data_record") * 256);
  };

  EDFFile.prototype.get_header_item = function(name) {
  var spec;
  if (this._header_item[name] != null) {
    return this._header_item[name];
  }
  spec = this._get_header_spec(name);
  this._header_item[name] = this._get_buffer_slice(spec.length, spec.position).toString().trim();
  return this._header_item[name];
};

  EDFFile.prototype._get_header_spec = function(name) {
  var _o; var j; var len; var position; var x;
  position = 0;
  for (j = 0, len = _header_spec.length; j < len; j++) {
    x = _header_spec[j];
    if (x.name === name) {
      _o = x;
      _o["position"] = position;
      return _o;
    } else {
      position += x.length;
    }
  }
};

  EDFFile.prototype._get_buffer_slice = function(length, position) {
  var k;
  k = new Buffer(length);
  fs.readSync(this._handle, k, 0, length, position);
  return k;
};

  EDFFile.prototype._get_signal_obj = function(signal_index) {
  var _o;
  _o = _signals[signal_index];
  _o["gain"] = (parseFloat(_o.physical_max) - parseFloat(_o.physical_min)) / (parseFloat(_o.digital_max) - parseFloat(_o.digital_min));
  _o["offset"] = (_o.physical_max / _o.gain) - _o.digital_max;
  _o["sample_rate"] = _o.num_samples_in_data_record / this.get_header_item("duration_of_data_record");
  return _o;
};

  EDFFile.prototype.get_signal_item = function(signal_index, name) {
  var _i; var spec;
  _i = name + "_" + signal_index;
  if (this._signal_item[_i] != null) {
    return this._signal_item[_i];
  }
  spec = this._get_signal_spec(signal_index, name);
  //console.log('get_signal_item', signal_index, name, this._signal_item[_i], spec.length, spec.position);
  this._signal_item[_i] = this._get_buffer_slice(spec.length, spec.position).toString().trim();
  //console.log('get_signal_item', signal_index, name, this._signal_item[_i], spec.length, spec.position);
  return this._signal_item[_i];
};

  EDFFile.prototype._get_signal_spec = function(signal_index, name) {
  var position;
  position = 256;
  for (var j = 0, len = _signal_spec.length; j < len; j++) {
    var _o; var x;
    x = _signal_spec[j];
    if (x.name === name) {
      //console.log('getting signal spec', name, position, x.length, signal_index);
      _o = x;
      _o["position"] = position + (x.length * signal_index);
      return _o;
    } else {
      position += this.get_header_item("num_signals_in_data_record") * x.length;
    }
  }
};

var handle = fs.openSync(file, "r");


var edfData = new EDFFile(file);
var fileHeader = edfData._header_item;
console.log(fileHeader);
var gain1 = edfData._get_signal_obj(0).gain;
var gain2 = edfData._get_signal_obj(1).gain;
var offset1 = edfData._get_signal_obj(0).offset;
var offset2 = edfData._get_signal_obj(1).offset;
console.log(offset1, offset2);
var signalCount = parseInt(fileHeader["num_signals_in_data_record"]);
var recordCount = parseInt(edfData._get_buffer_slice(8, 236).toString());
var totalSamples = _signals.reduce((accum, cur) => {
  //console.log(cur, parseInt(cur["num_samples_in_data_record"]), parseInt(cur["sample_rate"]), recordDuration);
  return accum + parseInt(cur["num_samples_in_data_record"]) * recordCount;
}, 0);



var bytes = 2 * 200; // 2 bytes per sample
//
//console.log(bytes, _signals, fileHeader);
var start = 256+256*signalCount+signalCount*30*200;
var signalData = edfData._get_buffer_slice.call(edfData, bytes, start);
var nums = [];
for (var z = 0; z < bytes; z += 2) {
  nums.push(signalData.readInt16LE(z));
}
var sampleRate = parseInt(_signals[0]["sample_rate"]);
var lines = [];
for (var i = 0; i < nums.length; i += 2) {
  lines.push("" + (30+(i / 2) / sampleRate) + ',' + (nums[i] + offset1) * gain1 + ',' + (nums[i + 1] + offset2) * gain2 + ',' + nums[i] + ',' + nums[i + 1]);
}
var sliceStart = 5000;
console.log(nums.length, lines(0,50));