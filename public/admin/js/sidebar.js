import APIService from "../../utils/api_service.js";

$(document).ready(async function () {
    const userInfo = await APIService.userInfo();
    $('#adminName').text(userInfo.name);
    if(userInfo.avatar){
        $('#userAvatarSidebar').attr('src', userInfo.avatar);
    }
});