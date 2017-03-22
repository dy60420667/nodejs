var fs = require('fs');
var os = require('os');
var express = require('express');
var child_process = require('child_process');
var router = express.Router();
// var app_autosizn_file = "./public/python/";//自动签名文件存放位置
var app_autosizn_file = "D:/CodeGen/tmp/";//自动签名文件存放位置
var app_jiaoben = "D:/CodeGen/"

//0表示数据初始状态，-1表示数据未上传，1表示上传成功
var file_share_icon = 0;//分心的图片是否上传成功
var file_ic_launcher = 0;//icon是否上传陈宫
var source_isok = 0;//数据是否上传成功

function isAllOk() {
    if(source_isok!=1){
        return false;
    }
    if(file_ic_launcher!=1){
        return false;
    }

    if(file_share_icon==0){
        return false;
    }
    return true;
}


//处理上传的图片
var handleFile = function(fieldname,file,filename) {
    console.log("handleFile")
    // var targetFile = app_autosizn_file+filename;

    var targetFile = app_autosizn_file + fieldname+'.png';

    var fstream;
    console.log("------------------")
    console.log("Uploading: " + filename + ' to ' + targetFile);
    fstream = fs.createWriteStream(targetFile);
    file.pipe(fstream);
    var passedLength = 0;
   
    fstream.on('data', function(chunk) {
        passedLength += chunk.length;
        console.log("已下载："+passedLength);
    });
    fstream.on('close', function () {
        if(fieldname=='ic_launcher'){
            file_ic_launcher = 1;
        }
        if(fieldname=='share_icon'){
            file_share_icon = 1;
        }

        console.log('文件传送完毕')
        console.log('Saved file: '+targetFile);
        //开始执行自动化脚本

        if(isAllOk()){
            exceAutoSign();
        }else{
            console.log('文件不存在或者资源没有全部上传')
        }
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
    try{
        fs.unlinkSync(app_autosizn_file+'ic_launcher.png');
    }catch (err){
        console.log(err)
    }
    try{
        fs.unlinkSync(app_autosizn_file+'share_icon.png');
    }catch (err){
        console.log(err)
    }
    try{
        fs.unlinkSync(app_autosizn_file+'tmp.json');
    }catch (err){
        console.log(err)
    }
    try{
        fs.unlinkSync(app_autosizn_file+'str');
    }catch (err){
        console.log(err)
    }

    file_share_icon = 0;
    file_ic_launcher  = 0;
    source_isok = 0;
};


//执行自动签名的脚本
var exceAutoSign = function(){
    var jiaoben = "python "+app_jiaoben+"GenerateApp.py "+ app_autosizn_file+"temp_app.json "+app_jiaoben+"config.gradle.template";
    // var jiaoben = 'python '+app_autosizn_file+"autosign.py"
    console.log('开始执行自动化脚本'+jiaoben)

    var exec = child_process.exec;
    exec(jiaoben,function(error,stdout,stderr){
        if(stdout.length >1){
            console.log('you offer args:',stdout);
        } else {
            console.log('you don\'t offer args');
        }
        if(error) {
            console.info('stderr : '+stderr);
            fs.writeFileSync(app_autosizn_file+"str","1");
        }else{
            console.log('apk is sucess');
            fs.writeFileSync(app_autosizn_file+"str","0");
        }
    });
};

var handleGetStr = function(req,res){
    console.log('handleGetStr');
    var data="2";
    try{
        data = fs.readFileSync(app_autosizn_file+"str");
    }catch(e){
        console.log('readfile error ')
    }
    console.log('readfile:'+data);
    res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost"});
    res.write(data);
    res.end();
};

var  fileapk_debug;
var handleDownload_debug = function(req,res){
    res.setHeader('Content-disposition', 'attachment; filename=app_debug.apk');
    var path = app_jiaoben+"code/app/build/outputs/apk/app_debug.apk"
    fileapk_debug = fs.createReadStream(path);
    fileapk_debug.pipe(res);
};
// D:\CodeGen\code\app\build\outputs\apk
var  fileapk_release;
var handleDownload_release = function(req,res){
    res.setHeader('Content-disposition', 'attachment; filename=app_release.apk');
    var path = app_jiaoben+"code/app/build/outputs/apk/app_release.apk"
    fileapk_release = fs.createReadStream(path);
    fileapk_release.pipe(res);
};

var json_field_result = {};//结果数据

// 接收数据
var handleForm = function(req, res) {
    console.log('handleForm');
    initAutoSign();

    if(fileapk_debug!=null){
        fileapk_debug.unpipe(res);
    }
    var result = { files: [], fields: [] };
    var json_field = {};//接收到的json数据收集，用以缓存Json文件

    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
        console.log("file:fieldname,"+fieldname+",file:"+file+",filename:"+filename)
        if(isDefined(filename)) {
    	   result.files.push({ name: filename});
    	   handleFile(fieldname,file,filename);
    	}
    });
    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
        console.log('Field received: '+key+' = '+value);
        result.fields.push({name: key, val: value });
        console.log('_______________:'+result.fields);
        json_field[key] = value;
        
        if(key=="intro"){
            console.log("json_field:"+json_field)

            json_field_result["appname"] = json_field['appname'];
            json_field_result["versionname"] = json_field['versionname'];
            json_field_result["versioncode"] = json_field['versioncode'];
            json_field_result["packagename"] = json_field['packagename'];
            json_field_result["app.appkey"] = json_field['app_appkey'];
            json_field_result["app.appsecret"] = json_field['app_appsecret'];
            json_field_result["release_jpush_appkey"] = json_field['release_jpush_appkey'];
            json_field_result["debug_jpush_appkey"] = json_field['debug_jpush_appkey'];
            json_field_result["umeng_appkey"] = json_field['umeng_appkey'];
            json_field_result["audio"] = json_field['audio'];
            json_field_result["video"] = json_field['video'];

            json_field_result["appicon"] = {};
            json_field_result["appicon"]['mipmap-xxhdpi'] = app_autosizn_file+"ic_launcher.png";

            console.log("json_field[social]"+json_field['social'])
            if(json_field['social']=='false'){
                file_share_icon = -1;
            }else{
                // json_field_result["social"] = json_field['social'];
                json_field_result["socialize"] = {};
                json_field_result["socialize"]['share_icon'] = app_autosizn_file+"share_icon.png";
                json_field_result["socialize"]['wx_key'] = json_field['wx_key'];
                json_field_result["socialize"]['wx_secret'] = json_field['wx_secret'];
                json_field_result["socialize"]['qq_id'] = json_field['qq_id'];
                json_field_result["socialize"]['qq_key'] = json_field['qq_key'];
                json_field_result["socialize"]['sina_key'] = json_field['sina_key'];
                json_field_result["socialize"]['sina_secret'] = json_field['sina_secret'];
            }

            json_field_result["uicolor"] = {};
            json_field_result["uicolor"]['colorPrimary'] ="#" + json_field['colorPrimary'];
            json_field_result["uicolor"]['colorPrimaryDark'] ="#" +  json_field['colorPrimaryDark'];
            json_field_result["uicolor"]['colorAccent'] ="#" +  json_field['colorAccent'];
            json_field_result["uicolor"]['color_item_dark'] ="#" +  json_field['color_item_dark'];
            json_field_result["uicolor"]['color_item_normal'] ="#" +  json_field['color_item_normal'];

            fs.writeFileSync(app_autosizn_file+'tmp.json',JSON.stringify(json_field));
            fs.writeFileSync(app_autosizn_file+"temp_app.json",JSON.stringify(json_field_result));
            // json对象转化成字符串
            console.log('数据传送完毕')
            console.log(json_field_result)

            result.title="新闻客户端定制服务";
            res.render('afterUpload', result);

            source_isok = 1;
            if(isAllOk()){
                exceAutoSign();
            }else{
                console.log('文件不存在或者资源没有全部上传')
            }

        }
    });
    req.busboy.on('finish', function() {
        // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    });
    req.pipe(req.busboy);
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '新闻客户端定制服务' });
});

router.post('/addTask', handleForm);
router.get('/getstr', handleGetStr);
router.get('/downloadapk_release', handleDownload_release);
router.get('/downloadapk_debug', handleDownload_debug);

module.exports = router;
