import API_CALL from "./utils/api-call.js";
import {validateUserEmail,validateUserName,validateUserPassword} from "./utils/validate.js";

$(document).ready(function(){
    $('.toast').toast('hide');
  });

$("#signup").bind("click", async () => {
    $("#error").text("");

    const isValidUserEmail = validateUserEmail("useremail","error");
    const isValidUserName = validateUserName("username","error");
    const isValidUserPwd = validateUserPassword("userpwd","error");

    if(isValidUserEmail && isValidUserName && isValidUserPwd) {
    const email = $("#useremail").val();
    const name = $("#username").val();
    const password = $("#userpwd").val();
    
      const userInfo = {
        email: email,
        name: name,
        password: password,
    }
    console.log(userInfo);
    const response = await API_CALL.registerUserRequest(userInfo);
    if(response.status === 400) {
        // Validation in backend fail (this also include register same email)
        $(".text-danger").text(response.data.errors[0].msg);
    } else if(response.status === 200) {
        // success
        $('.toast-body').text("Check your Email and click that shit");
        $('.toast').toast('show');
    }
    }
});



$("#useremail").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserEmail("useremail","error");
  });

  $("#username").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserName("username","error");
  });


  $("#userpwd").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserPassword("userpwd","error");
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

