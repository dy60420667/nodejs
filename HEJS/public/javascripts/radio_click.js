function radio_check(onOroff,eleids,elerealy_id) {
    if(onOroff) {
        document.getElementById(eleids).getElementsByTagName('lable')[0].className = "radio_on_left"
        document.getElementById(eleids).getElementsByTagName('lable')[1].className = "radio_off_right"
    }else{
        document.getElementById(eleids).getElementsByTagName('lable')[0].className = "radio_off_left"
        document.getElementById(eleids).getElementsByTagName('lable')[1].className = "radio_on_right"
    }
    document.getElementById(elerealy_id).value = onOroff;
}

function socel_click(onOroff,social_tmp,socials_all,social) {
    if(onOroff) {
        document.getElementById(social_tmp).getElementsByTagName('lable')[0].className = "radio_on_left"
        document.getElementById(social_tmp).getElementsByTagName('lable')[1].className = "radio_off_right"
        document.getElementById('share_icon').style.display = "";
    }else{
        document.getElementById(social_tmp).getElementsByTagName('lable')[0].className = "radio_off_left"
        document.getElementById(social_tmp).getElementsByTagName('lable')[1].className = "radio_on_right"
        document.getElementById('share_icon').style.display = "none";
    }
    document.getElementById(social).value = onOroff;
        var socials = document.getElementById(socials_all).getElementsByTagName('label');
        console.log("socials:"+socials.length)
        for (var i =1;i<socials.length;i++){
            social_item = socials[i];
            console.log("social_item:"+social_item)
            social_item.style.display =onOroff?"":"none"
        }


}
    