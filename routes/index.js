var express = require('express');
var router = express.Router();
var qeegLib = require('../lib/qeeg-lib');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/qeeg/data', function(req,res,next) {
  res.status(200).send(qeegLib.qeegParse('test_r.rec'));
});

router.get('/qeeg/fft', function(req, res, next) {
  console.log('handling fft request');
  qeegLib.fft();

  /*
    PLOT #1
  epochs 4096 long starting at very beginning of tracing
  filter everything below 3 Hz
  Peak Frequency > minimum value for each epoch

    PLOT #2
  area under the curve from 5.5 Hz - 8 Hz as a function of time

    PLOT #3
  area under the curve from 8 Hz - 12 Hz as a function of time

 */
  console.log('chopping FFT data');
  let fullEpochs = qeegLib.filterEpochs(3.5, 100);
  let fullMaxes = qeegLib.getMaxPointArray(fullEpochs);
  let preAlphaEpochs = qeegLib.filterEpochs(3.5, 8);
  let preAlphaMaxes = qeegLib.getMaxPointArray(preAlphaEpochs);
  let alphaEpochs = qeegLib.filterEpochs(8, 12);
  let alphaMaxes = qeegLib.getMaxPointArray(alphaEpochs);
  let resultFFT = preAlphaEpochs[preAlphaEpochs.length - 1];
  //res.status(200).send(qeegLib.FFTArray[qeeg.FFTArray.length - 1]);

  let maxRangeCounts = [0, 0, 0];

  fullMaxes.forEach(cur => {
    let max = cur[0];
    if (max >= 3.5 && max <= 8) {
      maxRangeCounts[0]++;
    } else if (max > 8 && max <= 12) {
      maxRangeCounts[1]++;
    } else if (max > 12) {
      maxRangeCounts[2]++;
    }
  });
  console.log('max frequency breakdown: pre-alpha, alpha, post-alpha ', maxRangeCounts);
  res.status(200).send(resultFFT);
});



module.exports = router;
