var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '新闻客户端定制服务' });
});

/* GET home page. */
router.get('/task', function(req, res, next) {
  res.render('task', { title: '新闻客户端定制服务' });
});

/* GET home page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: '新闻客户端定制服务' });
});

/* GET home page. */
router.get('/autosign', function(req, res, next) {
  res.render('apktools/autosign', { title: '新闻客户端定制服务' });
});

/* GET home page. */
router.get('/apktool', function(req, res, next) {
  res.render('apktools/apktool', { title: '新闻客户端定制服务' });
});

/* GET home page. */
router.get('/descripty', function(req, res, next) {
  res.render('descripty', { title: '新闻客户端定制服务' });
});




var handleBack = function(req,res){
   console.Log('back');
   // window.history.go(-1);
};

router.get('back', handleBack);




module.exports = router;
