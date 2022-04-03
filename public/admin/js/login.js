import APIService from "../../utils/api_service.js";
import { cacheKey, sleep } from "../../utils/common.js";

$(document).ready(async function () {
  const cachedEmail = localStorage.getItem(cacheKey.adminEmailKey) ?? "";
  const cachedPwd = localStorage.getItem(cacheKey.adminPwdKey) ?? "";
  const rememberMe = localStorage.getItem(cacheKey.adminRememberMe);
  const autoLogin = localStorage.getItem(cacheKey.adminAutoLogin);
  if (autoLogin) {
    try {
      await APIService.login(cachedEmail, cachedPwd, "admin");
      window.location.replace("/admin/home");
    } catch (e) {
      console.log(e);
    }
  }
  await sleep(50);

  $("#emailInput").val(cachedEmail);
  $("#passwordInput").val(cachedPwd);
  $("#spinner").removeClass("show");
  if (rememberMe) {
    $("#rememberMeCheck").prop("checked", true);
  }

  $('#spinner').removeClass('show');

  $("#emailInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateEmail();
  });
  $("#passwordInput").on("input propertychange", function (e) {
    e.preventDefault();
    validatePassword();
  });

  $("#loginSubmit").click(function (e) {
    e.preventDefault();
    const email = validateEmail();
    const pwd = validatePassword();
    if (!(email && pwd)) {
      return;
    }
    const rememberMe = $("#rememberMeCheck").is(":checked");
    loginFormSubmit(email, pwd, rememberMe);
  });
});

function validateEmail() {
  const input = $("#emailInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#emailErrorMsg").text("Email can't be empty");
    $("#emailInput").addClass("is-invalid");
    return false;
  }

  if (!validator.isEmail(input)) {
    $("#emailErrorMsg").text("Invalid email format");
    $("#emailInput").addClass("is-invalid");
    return false;
  }

  $("#emailInput").removeClass("is-invalid");
  return input;
}

function validatePassword() {
  const input = $("#passwordInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#passwordErrorMsg").text("Password can't be empty");
    $("#passwordInput").addClass("is-invalid");
    return false;
  }
  $("#passwordInput").removeClass("is-invalid");
  return input;
}

async function loginFormSubmit(email, pwd, rememberMe) {
  try {
    await APIService.login(email, pwd, "admin");
    $("#serverError").text("");
    if (rememberMe) {
      localStorage.setItem(cacheKey.adminEmailKey, email);
      localStorage.setItem(cacheKey.adminPwdKey, pwd);
      localStorage.setItem(cacheKey.adminRememberMe, rememberMe);
      localStorage.setItem(cacheKey.adminAutoLogin, true);
    } else {
      localStorage.removeItem(cacheKey.adminEmailKey);
      localStorage.removeItem(cacheKey.adminPwdKey);
      localStorage.removeItem(cacheKey.adminRememberMe);
    }
    window.location.replace("/admin/home");
  } catch (err) {
    console.log(err);
    $("#serverError").text(err.message);
  }
}
