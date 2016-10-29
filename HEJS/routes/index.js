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


module.exports = router;
