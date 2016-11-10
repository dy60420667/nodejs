var fs = require('fs');
var os = require('os');
var express = require('express');
var child_process = require('child_process');
var router = express.Router();
var app_autosizn_file = "./public/python/";//自动签名文件存放位置



var handleFile = function(filename, file, targetDir) {
    // var targetFile = targetDir + filename;
    var targetFile = app_autosizn_file+filename;
 
    var fstream;

    console.log("Uploading: " + filename + ' to ' + targetFile);
    fstream = fs.createWriteStream(targetFile);
    file.pipe(fstream);
    var passedLength = 0;
   
    fstream.on('data', function(chunk) {
        passedLength += chunk.length;
        console.log("已下载："+passedLength);

    });

    fstream.on('close', function () {
        // Note to self: Fire off an event to handle the file in tmp here (check it, thumbs gen, record it, remove it)
        console.log('Saved file: '+targetFile);
        exceAutoSign();
    });
    fstream.on('error', function () {
        console.log('ERROR while saving file: '+filename);
    });
};

var isDefined = function(str) {
    return (typeof str != 'undefined' && null != str && '' != str);
}

//初始化Python脚本
var initAutoSign = function(){
    fs.unlink(app_autosizn_file+'ic_launcher.png',function(err) {
       if (err) {
           return console.error(err);
       }
       console.log("ic_launcher.png文件删除成功！");
    });
    fs.unlink(app_autosizn_file+'tmp.json',function(err) {
       if (err) {
           return console.error(err);
       }
       console.log("tmp.json文件删除成功！");
    });
}

//执行自动签名的脚本
var exceAutoSign = function(){
    console.log('开始执行自动化脚本')
    var exec = child_process.exec;
    exec('python '+app_autosizn_file+"autosign.py",function(error,stdout,stderr){
         if(stdout.length >1){
             console.log('you offer args:',stdout);
         } else {
             console.log('you don\'t offer args');
         }
         if(error) {
            console.info('stderr : '+stderr);
         }else{
            console.log('apk is sucess');
            

            
            document.getElementById("result").innerHTML = "这是动态添加的" ;
         }
    });
}

// Parse form and handle files and fields.
var handleForm = function(req, res) {
    initAutoSign();

    var result = { files: [], fields: [] };
    var jsonField = {};

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
        jsonField[key] = value;

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
        
        fs.writeFileSync(app_autosizn_file+'tmp.json',JSON.stringify(jsonField));

        // json对象转化成字符串
        // JSON.stringify(obj)

    	result.title="新闻客户端定制服务";
        res.render('afterUpload', result);
        // res.render(result);
    });
    req.pipe(req.busboy);

};

/* GET home page. */
router.post('/addTask', handleForm);

module.exports = router;
