import API_CALL from "./utils/api-call.js";
import authentication from "./utils/auth.js";

$(document).ready(async function () {
  const currentURL = window.location.href;
  const lastSegment = currentURL.split("/").pop();

  if(lastSegment.length > 0 ) {
  $(`#header__${lastSegment}`).addClass("active");
  }
  else   $(`#header__index`).addClass("active");

  const refreshToken = authentication.getRefreshToken();
  if(refreshToken) {
    $("#login-header").hide();
  } else {
    $("#logout-header").hide();
  }


  });

  $("#logout-header").on("click",async function() {
    const refreshToken = authentication.getRefreshToken();
    if(refreshToken) {
      
      const response = await API_CALL.logoutRequest()
      console.log(response);
      if(response.status ===200 || response.status ===403) {
        console.log(response.data.msg);
        
        authentication.removeToken();

        const host = window.location.host;
        window.location.href = `http://${host}/login`; 

      }else if(response.status === 403) {
      }
    }
  })
  
  