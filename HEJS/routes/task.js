var fs = require('fs');
var os = require('os');
var express = require('express');
var router = express.Router();

var handleFile = function(filename, file, targetDir) {
    // var targetFile = targetDir + filename;
    var targetFile = './public/upload/'+filename;
 
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

/* GET home page. */
router.post('/addTask', handleForm);

module.exports = router;
