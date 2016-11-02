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
    });

    req.busboy.on('finish', function() {
        res.render('afterUpload', result);
    });
    req.pipe(req.busboy);

};


module.exports = handleForm;
