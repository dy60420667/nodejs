// var express = require('express');
// var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
var Busboy = require('busboy'),
    fs = require('fs'),
    path = require('path'),
    inspect = require('util').inspect;
module.exports = function  (app) {
	app.get('/', function(req, res, next) {
          res.render('index', { title: '登陆' });
    })
    app.get('/upload',function(req,res,next) {
    	res.render('upload',{ title: '上传文件'});
    })
    app.post('/upload',function(req,res,next) {
        var tmp_path = req.files.test.path;
        var target_path = './public/images/' + req.files.test.originalname;
        fs.rename(tmp_path,target_path,function(err) {
            if (err) throw err;
            fs.unlink(tmp_path,function() {
                if (err) throw err;
                res.send('File upload to: ' + target_path + '-' +req.files.test.size + 'bytes')
            })
        })
    })
}