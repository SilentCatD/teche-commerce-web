import APIService from "../../utils/api_service.js";
import {validateUserPassword} from "./utils/validate.js";

$(document).ready(async () => {
    $("#confirm").bind("click", async () => {
        console.log("fucl");
        if (!validateUserPassword("userpwd", "password-error")) {
            return;
          }
      
          const password = $("#userpwd").val();
          const confirmPassword = $("#userpwd-confirm").val();
      
          if(password != confirmPassword) {
              $("#password-confirm-error").text("Password not match")
              return;
          }
      
          try {
            const response = await APIService.verifyResetPassword(hash,password);
            window.location.href = `/`;
          } catch (err) {
            console.log(err);
            $("#error").text(err.message);
          }
      });
})


$("#userpwd").on("input propertychange", function (e) {
  e.preventDefault();
  validateUserPassword("userpwd", "password-error");
});

$("#userpwd-confirm").on("input propertychange", function (e){
    e.preventDefault();
    $("#password-confirm-error").text("")
})

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
