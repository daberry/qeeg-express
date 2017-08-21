var express = require('express');
var router = express.Router();
var qeegLib = require('../lib/qeeg-lib');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.get('/qeeg/data', function(req,res,next) {


  res.status(200).send(qeegLib.qeegParse('Russo 21_01_16 14_36_18 00.42 to 20.03.rec'));
});



module.exports = router;
