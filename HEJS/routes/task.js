// var Task = require('./../models/Task.js');
var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.post('/addTask', function(req, res) {	
	console.log('123131----');
	// res.send(req.body);
	//生成multiparty对象，并配置上传目标路径
  	var form = new formidable.IncomingForm();
  	form.uploadDir="/public/images/tmp/";//设置临时文件存放的路径
	form.encoding='utf-8';//设置上传数据的编码
	form.keepExtensions=true;//设置是否保持上传文件的拓展名
	form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

  	console.log(form);
  	form.parse(req,function(err,fields,files){
  		if (err) {
		  res.render(err); 
		  return;
		}  
  		console.log(files.path);
  		console.log('123131');
  		fs.renameSync(files.path,form.uploadDir+files.name);
        response.writeHead(200,{"Content-Type":"text.html"});
		response.write("received image");
		response.end();
		res.render("上传成功");
  	});
});

/* GET home page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: '关于定制服务' });
});


module.exports = router;





