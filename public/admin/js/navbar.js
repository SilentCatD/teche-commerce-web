import APIService from "../../utils/api_service.js";
import { backToLogin, cacheKey, clearCache } from "../../utils/common.js";

let userData;

async function fetchAndDisplayUserEmail(){
    try{
        userData = await APIService.userInfo();
        console.log(userData);
        $("#userEmail").text(userData.email);

    }catch(e){
        console.log(e);
        backToLogin('admin', '/admin');
    }
}

$(document).ready(function () {
    fetchAndDisplayUserEmail();

  $("#logoutBtn").click(async function (e) {
    e.preventDefault();
    await APIService.logout("admin");
    backToLogin('admin', '/admin');
  });
});
