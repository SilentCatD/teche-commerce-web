import API_CALL from "./utils/api-call.js";
import authentication from "./utils/auth.js";

$(document).ready(async function () {
  const currentURL = window.location.href;
  const lastSegment = currentURL.split("/").pop();

  const refreshToken = authentication.getRefreshToken();
  if(refreshToken) {
    $("#login-header").hide();
    $("#login-humberger").hide();
  } else {
    $("#logout-header").hide();
    $("#logout-humberger").hide();
    $(".user-cart").hide();
    $(".join-us").html("<a class='text-primary' href='signup'>Do you want join us <bold>Register Now!</bold></a>")
  }

  const userName = authentication.getUserName();
  if(userName) {
    $(".user-name").html(`<i class='fa fa-user'></i>${userName}`);
  } else {
    $(".user-name").html("");
  }

  if(lastSegment.length > 0 ) {
  $(`#header__${lastSegment}`).addClass("active");
  }
  else   $(`#header__index`).addClass("active");
  });

  $(".logout").on("click",async function() {
    const refreshToken = authentication.getRefreshToken();
    if(refreshToken) {
      
      const response = await API_CALL.logoutRequest()
      console.log(response);
      if(response.status ===200 || response.status ===403 ||response.status ===401 ) {
        console.log(response.data.msg);
        
        authentication.removeToken();
        window.location.reload();
      }
    }
  })

  $(".join-us").on("click",async function() {
    const host = window.location.host;
    window.location.href = `http://${host}/signup`;
  })
  
  