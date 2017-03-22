var myVar,index = 0 ;
/*setInterval() 间隔指定的毫秒数不停地执行指定的代码*/
function startTimer(){ 
    timestart_apk_is_sign_ok =0;
    timeend_apk_is_sign_ok =0;
    myVar=setInterval(function(){myTimer()},1000);
}
//服务开始时间
var timestart_apk_is_sign_ok =0;
//服务结束时间
var timeend_apk_is_sign_ok =0;
//超时时间5分钟
var timeout_apk_is_sign_ok = 5*60*1000;

/* 定义一个得到本地时间的函数*/
function myTimer(){
    console.log('myTimer:'+getLocalTime());
    var xhr=new XMLHttpRequest();
    xhr.open("GET","getstr",true);
    xhr.onreadystatechange=function(){
         console.log('onreadystatechange:');
         if(timestart_apk_is_sign_ok==0){
            timestart_apk_is_sign_ok = getCurrentTime();
         }
         if(xhr.readyState==4){
             if(xhr.status==200){
                    if(xhr.responseText==0){
                        doOK();
                    }else if(xhr.responseText==1){
                        doError();
                    }else{
                        doNormal();    
                    }
             }else{
                doNormal();
             }
         }else{
            doNormal();
         }
     }
     xhr.send(null);
}

function getCurrentTime(){
    var d  = new Date();
    return d.getTime();
}

/* clearInterval() 方法用于停止 setInterval() 方法执行的函数代码*/
function stopTimer(){
    clearInterval(myVar);
}

function doOK(){
    stopTimer();
    document.getElementById("result_1").innerHTML='';
    document.getElementById("result").innerHTML='';
    document.getElementById("down_debug").innerHTML = "打包成功，点击下载测试包";
    document.getElementById("down_debug").innerHTML = "打包成功，点击下载正式包";
    document.getElementById("down_debug").style.display = "block";
    document.getElementById("down_release").style.display = "block";
}

function doError(){
    stopTimer();
    document.getElementById("result_1").innerHTML='打包出现异常，请重新提交';
    document.getElementById("result").innerHTML='';
}

function doTimeOut(){
    stopTimer();
    document.getElementById("result_1").innerHTML='打包超时，请重新提交';
    document.getElementById("result").innerHTML='';
    document.getElementById("down_debug").style.display = "none";
    document.getElementById("down_release").style.display = "none";
}

function doNormal(){
    index =index%7;
    index++;
    var cars=["","打","包","中",".",".","."];
    var text="";
    for (var i=0;i<index;i++){
        text +=cars[i];
    }
    document.getElementById("result").innerHTML='请请耐心等待。后台'+text;
    document.getElementById("down_debug").innerHTML = "当前时间："+getLocalTime();

    timeend_apk_is_sign_ok = getCurrentTime()
    document.getElementById("down_release").innerHTML= "已耗时:"+formatTime(timeend_apk_is_sign_ok-timestart_apk_is_sign_ok );
    document.getElementById("down_debug").style.display = "block";
    document.getElementById("down_release").style.display = "block";

    checkTimeOut();
}


function checkTimeOut(){
    timeend_apk_is_sign_ok = getCurrentTime();
    console.log('耗时：'+(timeend_apk_is_sign_ok-timestart_apk_is_sign_ok ));
    if(timeend_apk_is_sign_ok-timestart_apk_is_sign_ok >= timeout_apk_is_sign_ok){
        doTimeOut();
    }
}


function formatTime(time) {
    time   = time/1000;
    var time_second = parseInt(time%60);
    var time_munite = parseInt(time/60);
    return time_munite+"分钟"+time_second+"秒"
}

function getLocalTime() {
    var d=new Date();
    var t=d.toLocaleTimeString();
    return t;
}

startTimer()