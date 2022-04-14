import APIService from "../../utils/api_service.js";
import {validateUserEmail} from "./utils/validate.js";

$("#forget-password").on("click", async (event) => {
  console.log("fuck");
  $("#modal-forget-password").modal("show");
});

$("#send-forget-password").on("click", async (event) => {

  if(!validateUserEmail("user-email-forget", "forget-error")) {
    return;
  }
    const email = $("#user-email-forget").val();
    try {
    const res = await APIService.requestResetPassword(email);
    $("#modal-forget-password").modal("hide");
    $('.toast-body').text("Check your Email and click that shit");
    $('.toast').toast('show');
    } catch(err) {
      console.log(err.message);
    }
});

$("#login").bind("click", async () => {
  $("#error").text("");

  const email = $("#useremail").val();
  const password = $("#userpwd").val();

  const userInfo = {
    email: email,
    password: password
  }

  try {
    const response = await APIService.login(email,password,"user");
    window.location.href = `/`;
  } catch (err) {
    console.log(err);
    $(".text-danger").text(err.message);
  }
});


$("#useremail").on("input propertychange", function (e) {
  e.preventDefault();
  validateUserEmail("useremail", "error");
});


$("#user-email-forget").on("input propertychange", function (e) {
  e.preventDefault();
  validateUserEmail("user-email-forget", "forget-error");
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
