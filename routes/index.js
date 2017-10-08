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
  //console.log('handling fft request');
  qeegLib.fft();

  //console.log('chopping FFT data');
  let fullEpochs = qeegLib.filterEpochs(3, 100);
  let fullMaxes = qeegLib.getMaxPointArray(fullEpochs);
  let fullAreas = qeegLib.getIntegralArray(fullEpochs);
  fullAreas[0] = fullAreas[1];

  let preAlphaEpochs = qeegLib.filterEpochs(5.5, 8);
  let preAlphaAreas = qeegLib.getIntegralArray(preAlphaEpochs);
  preAlphaAreas[0] = preAlphaAreas[1];

  let alphaEpochs = qeegLib.filterEpochs(8, 12);
  let alphaAreas = qeegLib.getIntegralArray(alphaEpochs);
  alphaAreas[0] = alphaAreas[1];

  let resultFFT = preAlphaEpochs[preAlphaEpochs.length - 1];
  //res.status(200).send(qeegLib.FFTArray[qeeg.FFTArray.length - 1]);

  let maxRangeCounts = [0, 0, 0, 0];

  fullMaxes.forEach(cur => {
    let max = cur[0];
    if (max >= 3 && max <= 5.5) {
      maxRangeCounts[0]++;
    } else if (max > 5.5 && max <= 8) {
      maxRangeCounts[1]++;
    } else if (max > 8 && max <= 12) {
      maxRangeCounts[2]++;
    } else if (max > 12) {
      maxRangeCounts[3]++;
    }
  });
  console.log('max frequency breakdown: pre-alpha, alpha, post-alpha ', maxRangeCounts);
  res.status(200).send({
    FFTData: resultFFT,
    fullAreas: fullAreas,
    preAlphaAreas: preAlphaAreas,
    alphaAreas: alphaAreas
  });
});



module.exports = router;
