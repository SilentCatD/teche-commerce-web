import APIService from "../../utils/api_service.js";
import { cacheKey } from "../../utils/common.js";
import {validateUserEmail} from "./utils/validate.js";

$(document).ready(async function () {
  const cachedEmail = localStorage.getItem(cacheKey.emailKey) ?? "";
  const cachedPwd = localStorage.getItem(cacheKey.pwdKey) ?? "";
  const rememberMe = localStorage.getItem(cacheKey.rememberMe);
  $("#useremail").val(cachedEmail);
  $("#userpwd").val(cachedPwd);
  if (rememberMe) {
    $("#rememberMeCheck").prop("checked", true);
  }
});

$("#forget-password").on("click", async (event) => {
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
    $('.toast-body').text("Check your email and click the link to activate your account");
    $('.toast').toast('show');
    } catch(err) {
      console.log(err.message);
    }
});

$("#login").click(async () => {
  $("#error").text("");

  const email =   validateUserEmail("useremail", "error");
  if(!email) return;
  const password = $("#userpwd").val();
  const rememberMe = $("#rememberMeCheck").is(":checked");
  const userInfo = {
    email: email,
    password: password
  }

  try {
    await APIService.login(email,password,"user");
    if (rememberMe) {
      localStorage.setItem(cacheKey.emailKey, email);
      localStorage.setItem(cacheKey.pwdKey, password);
      localStorage.setItem(cacheKey.rememberMe, rememberMe);
    } else {
      localStorage.removeItem(cacheKey.emailKey);
      localStorage.removeItem(cacheKey.pwdKey);
      localStorage.removeItem(cacheKey.rememberMe);
    }
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
