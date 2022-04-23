import APIService from "../../utils/api_service.js";

$(document).ready(async function () {
    const userName = await APIService.userInfo();
    $('#adminName').text(userName.name);
});