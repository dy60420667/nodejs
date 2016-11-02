// // var Task = require('./../models/Task.js');
// var express = require('express');
// var formidable = require('formidable');
// var fs = require('fs');
// var router = express.Router();
// var os = require('os');

// var handleAbout = function(req, res, next) {
//   res.render('about', { title: '关于定制服务' });
// };

// var handleForm = function(res, req){
//     var form        = new formidable.IncomingForm();
// 	form.encoding = 'utf-8';        //设置编辑
// 	form.uploadDir = 'public/images/tmp';     //设置上传目录
// 	form.keepExtensions = true;     //保留后缀
// 	form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

// 	console.log('------form----');
// 	console.log('------IncomingForm----');
// 	console.log("req:"+req.toString());
// 	console.log("req.body:"+req.body);
// 	console.log("req.files:"+req.files);
// 	console.log("req.params:"+req.params);
// 	console.log("req.Headers:"+req.Headers);
// 	console.log("req.query:"+req.query);
// 	console.log('form:'+form.toString());
// 	if (!fs.existsSync(form.uploadDir)) {
// 		fs.mkdirSync(form.uploadDir);
// 	}
//     form.parse(req,function(error, fields, files){
//     	console.log('------parse----');
// 	    var types       = files.upload.name.split('.');
// 	    var date        = new Date();
// 	    var ms          = Date.parse(date);
// 	    fs.renameSync(files.upload.path,"/tmp/files"+ ms +"."+String(types[types.length-1]));
// 	    console.log('end prase');
//     });
//     console.log('上传成功');
// }

// /* GET home page. */
// router.post('/addTask', handleForm);

// /* GET home page. */
// router.get('/about', handleAbout);
// module.exports = router;
var fs = require('fs');
var os = require('os');

var handleFile = function(filename, file, targetDir) {
    var targetFile = targetDir + filename;
    var fstream;

    console.log("Uploading: " + filename + ' to ' + targetFile);
    fstream = fs.createWriteStream(targetFile);
    file.pipe(fstream);

    fstream.on('close', function () {
        // Note to self: Fire off an event to handle the file in tmp here (check it, thumbs gen, record it, remove it)
        console.log('Saved file: '+filename);
    });
    fstream.on('error', function () {
        console.log('ERROR while saving file: '+filename);
    });
};

var isDefined = function(str) {
    return (typeof str != 'undefined' && null != str && '' != str);
}

// Parse form and handle files and fields.
var handleForm = function(req, res) {
    var result = { files: [], fields: [] };

    req.busboy.on('file', function (fieldname, file, filename) {
        if(isDefined(filename)) {
	   result.files.push({ name: filename});
	   handleFile(filename, file, os.tmpdir());
	}
    });
    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
        console.log('Field received: '+key+' = '+value);
        result.fields.push({ 'name': key, val: value });
        console.log('_______________:'+result.fields);
    });
    req.busboy.on('finish', function() {
    	console.log('result:'+result);
        var txt = "";
        var x;
        for (x in result.fields){
            console.log("xxxxx:"+result.fields[x].name);
            console.log("xxxxx:"+result.fields[x].val);
            txt = txt+result.fields[x].val;
        }
            

        console.log('txt:'+txt)
    	result.title="新闻客户端定制服务";
        res.render('afterUpload', result);
        // res.render(result);
    });
    req.pipe(req.busboy);

};


module.exports = handleForm;
