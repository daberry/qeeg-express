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
  res.status(200).send(qeegLib.fft());
});



module.exports = router;
