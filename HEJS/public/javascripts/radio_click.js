function radio_check(onOroff,eleids) {
    if(onOroff) {
        document.getElementById(eleids).getElementsByTagName('lable')[0].className = "radio_on_left"
        document.getElementById(eleids).getElementsByTagName('lable')[1].className = "radio_off_right"
    }else{
        document.getElementById(eleids).getElementsByTagName('lable')[0].className = "radio_off_left"
        document.getElementById(eleids).getElementsByTagName('lable')[1].className = "radio_on_right"
    }
    document.getElementById(eleids).value = onOroff;
}

function socel_click(onOroff,eleids,eleids_title) {
    if(onOroff) {
        document.getElementById(eleids).getElementsByTagName('lable')[0].className = "radio_on_left"
        document.getElementById(eleids).getElementsByTagName('lable')[1].className = "radio_off_right"
        document.getElementById('share_icon').style.display = "";
    }else{
        document.getElementById(eleids).getElementsByTagName('lable')[0].className = "radio_off_left"
        document.getElementById(eleids).getElementsByTagName('lable')[1].className = "radio_on_right"
        document.getElementById('share_icon').style.display = "none";
    }
    document.getElementById(eleids).value = onOroff;
        var socials = document.getElementById(eleids_title).getElementsByTagName('label');
        console.log("socials:"+socials.length)
        for (var i =0;i<socials.length;i++){
            social_item = socials[i];
            console.log("social_item:"+social_item)
            social_item.style.display =onOroff?"":"none"
        }


}
    