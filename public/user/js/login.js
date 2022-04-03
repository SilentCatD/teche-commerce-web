import API_CALL from "./utils/api-call.js";
import authentication from "./utils/auth.js";
import { validateUserEmail } from "./utils/validate.js";

$(document).ready(async function () {});

$("#login").bind("click", async () => {
  $("#error").text("");

  const email = $("#useremail").val();
  const password = $("#userpwd").val();

  const response = await API_CALL.loginRequest(email, password);
  console.log(response);
  if (response.status === 400) {
    // something fuckup validtor in backend
    $(".text-danger").text(response.data.errors[0].msg);
  } else if (response.status === 403) {
    // wrong password
    $(".text-danger").text(response.data.msg);
  } else if (response.status === 200) {
    // success login, now real stuff begin
    authentication.sayHello();

    // what the hell is this (data.success)

    // step 1: extract jwt token (acess token and refresh token)
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    // step 2: save some where (seasionStorage)
    authentication.setJwtToken(accessToken);
    authentication.setRefreshToken(refreshToken);
    authentication.setUserName(response.data.userName);

    // step 3: redirect homePage customer or admin
    const jwtToken = authentication.getJwtToken();
    console.log(response);
    if (jwtToken) {
      // step4: redirect to customer previous page (i dunnu how)
      console.log("Token save in local storage");
      history.back();
    }
  }
});

$("#refresh").bind("click", async () => {
  $("#error").text("");

  const response = await API_CALL.newTokenRequest();
  console.log(response);
  if (response.status === 500) {
    // something fuckup validtor in backend
    $(".text-danger").text("Server fuckup");
  } else if (response.status === 403) {
    // RefreshToken Fuckup
    $(".text-danger").text(response.data.msg);
  } else if(response.status === 401) {
    $(".text-danger").text("Token can't verify or be expire");
  }else if (response.status === 200) {
    const accessToken = response.data.accessToken;
    // step 2: save some where (seasionStorage)
    authentication.setJwtToken(accessToken);

    // step 3: redirect homePage customer or admin
    const jwtToken = authentication.getJwtToken();
    if (jwtToken) {
      // step4: redirect to customer previous page (i dunnu how)
      console.log("Token save in storage seasion");
    }
  }
});

async function getAccessToken() {
  const host = window.location.host;
  if (!authentication.getRefreshToken()) {
    window.location.href = `http://${host}/login`;
  } else {
    const response = await API_CALL.newTokenRequest();
    console.log(response);
    if (response.status === 200) {
      const accessToken = response.data.accessToken;
      authentication.setJwtToken(accessToken);
      const jwtToken = authentication.getJwtToken();
      if (jwtToken) {
        console.log("Token save in storage seasion");
      }
    } else {
      window.location.href = `http://${host}/login`;
    }
  }
}

$("#useremail").on("input propertychange", function (e) {
  e.preventDefault();
  validateUserEmail("useremail", "error");
});

$("#password_show_hide").on("click", function (e) {
  const show_eye = $("#show_eye");
  const hide_eye = $("#hide_eye");

  const x = $("#userpwd");

  hide_eye.removeClass("d-none");
  if (x.attr("type") === "password") {
    x.attr("type", "text");
    show_eye.css("display", "none");
    hide_eye.css("display", "block");
  } else {
    x.attr("type", "password");
    show_eye.css("display", "block");
    hide_eye.css("display", "none");
  }
});
