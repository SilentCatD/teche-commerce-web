
import TokenService from "../../utils/token_service.js";

$(document).ready(async function () {
    let accessToken = getCookie("accessToken");
    let refreshToken = getCookie("refreshToken");
    
    if(accessToken) {
      TokenService.accessToken.set("user", accessToken);
    }
    if(refreshToken) {
        TokenService.refreshToken.set("user", refreshToken);
    }
    delete_cookie("accessToken");
    delete_cookie("refreshToken");
    
  });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }