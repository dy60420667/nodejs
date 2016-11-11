var myVar,index = 0 ;
/*setInterval() 间隔指定的毫秒数不停地执行指定的代码*/
function startTimer(){ 
    myVar=setInterval(function(){myTimer()},1000);
}
/* 定义一个得到本地时间的函数*/
function myTimer(){
    var xhr=new XMLHttpRequest();
    xhr.open("GET","task/getstr",true);
    xhr.onreadystatechange=function(){
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
/* clearInterval() 方法用于停止 setInterval() 方法执行的函数代码*/
function stopTimer(){
    clearInterval(myVar);
}

function doOK(){
    stopTimer();
    document.getElementById("result_1").innerHTML='';
    document.getElementById("result").innerHTML='';
    document.getElementById("down").style.display = "block";
}

function doError(){
    stopTimer();
    document.getElementById("result_1").innerHTML='打包出现异常，请重新提交';
    document.getElementById("result").innerHTML='';
    document.getElementById("down").style.display = "none";
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
    document.getElementById("result").innerHTML='请耐心等待。'+text;
    document.getElementById("down").style.display = "none";
}

startTimer()