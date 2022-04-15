import APIService from "../../utils/api_service.js";
import { cacheKey, sleep } from "../../utils/common.js";

$(document).ready(async function () {
  const cachedEmail = localStorage.getItem(cacheKey.emailKey) ?? "";
  const cachedPwd = localStorage.getItem(cacheKey.pwdKey) ?? "";
  const rememberMe = localStorage.getItem(cacheKey.rememberMe);
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
    await APIService.login(email, pwd, 'admin');
    $("#serverError").text("");
    if (rememberMe) {
      localStorage.setItem(cacheKey.emailKey, email);
      localStorage.setItem(cacheKey.pwdKey, pwd);
      localStorage.setItem(cacheKey.rememberMe, rememberMe);
    } else {
      localStorage.removeItem(cacheKey.emailKey);
      localStorage.removeItem(cacheKey.pwdKey);
      localStorage.removeItem(cacheKey.rememberMe);
    }
    window.location.replace("/admin/home");
  } catch (err) {
    $("#serverError").text(err.message);
  }
}
