var myVar,index = 0 ;
/*setInterval() 间隔指定的毫秒数不停地执行指定的代码*/
function startTimer(){ 
    timestart_apk_is_sign_ok =0;
    timeend_apk_is_sign_ok =0;
    myVar=setInterval(function(){myTimer()},5000);
}
var timestart_apk_is_sign_ok =0;
var timeend_apk_is_sign_ok =0;
var timeout_apk_is_sign_ok = 20*60*10000;

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
    document.getElementById("down_debug").style.display = "block";
    document.getElementById("down_release").style.display = "block";
}

function doError(){
    stopTimer();
    document.getElementById("result_1").innerHTML='打包出现异常，请重新提交';
    document.getElementById("result").innerHTML='';
    document.getElementById("down_debug").style.display = "none";
    document.getElementById("down_release").style.display = "none";
}

function doTimeOut(){
    stopTimer();
    document.getElementById("result_1").innerHTML='打包超时，请重新提交';
    document.getElementById("result").innerHTML='';
    document.getElementById("down_debug").style.display = "none";
    document.getElementById("down_release").style.display = "none";
}

function doNormal(){
    var d=new Date();
    var t=d.toLocaleTimeString();
    index =index%7;
    index++;
    var cars=["","打","包","中",".",".","."];
    var text="";
    for (var i=0;i<index;i++){
        text +=cars[i];
    }
    document.getElementById("result").innerHTML='请耐心等待。'+text+"\n"+getLocalTime();
    document.getElementById("down_debug").style.display = "none";
    document.getElementById("down_release").style.display = "none";

    checkTimeOut();
}


function checkTimeOut(){
    timeend_apk_is_sign_ok = getCurrentTime();
    console.log('耗时：'+(timeend_apk_is_sign_ok-timestart_apk_is_sign_ok ));
    if(timeend_apk_is_sign_ok-timestart_apk_is_sign_ok >= timeout_apk_is_sign_ok){
        doTimeOut();
    }
}

function getLocalTime() {
    var d=new Date();
    var t=d.toLocaleTimeString();
    return t;
}

startTimer()