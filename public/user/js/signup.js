import API_CALL from "./utils/api-call.js";
import {validateUserEmail,validateUserPassword} from "./utils/validate.js";

$(document).ready(function(){
    $('.toast').toast('hide');
  });

$("#signup").bind("click", async () => {
    $("#error").text("");
    const email = $("#useremail").val();
    const password = $("#userpwd").val();

    const response = await API_CALL.registerUserRequest(email,password);
    console.log(response);
    if(response.status === 400) {
        // something fuckup validtor in backend
        $(".text-danger").text(response.data.errors[0].msg);
    } else if(response.status === 403) {
        // wrong password 
        $(".text-danger").text(response.data.msg);
    } else if(response.status === 200) {
        $('.toast-body').text("Check your Email and click that shit");
        $('.toast').toast('show');
    }
});



$("#useremail").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserEmail("useremail","error");
  });


  $("#userpwd").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserPassword("useremail","error");
  });

function password_show_hide() {

    const show_eye = $("#show_eye");
    const hide_eye = $("#hide_eye");

    const x = $("#userpwd");

    console.log(x.attr('type'));
    console.log(show_eye);
    console.log(hide_eye);

    hide_eye.removeClass('d-none');
    if (x.attr("type") === "password") {
        x.attr("type","text");
        show_eye.css("display","none");
        hide_eye.css("display","block");
    } else {
        x.attr("type","password");
        show_eye.css("display","block");
        hide_eye.css("display","none");
    }
  }

