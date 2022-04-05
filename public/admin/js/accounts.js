import APIService from "../../utils/api_service.js";
import { goBackToLoginIfNotAdmin, sleep } from "../../utils/common.js";

$(document).ready(async function () {
  await goBackToLoginIfNotAdmin(), await sleep(50);
  $("#spinner").removeClass("show");

  $("#emailInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateEmail();
  });

  $("#passwordInput").on("input propertychange", function (e) {
    e.preventDefault();
    validatePassword();
  });

  $("#nameInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateName();
  });

  $("#accountSubmit").click(async function (e) {
    e.preventDefault();
    // const input = validateBrandNameInput();
    const email = validateEmail();
    const pwd = validatePassword();
    const name = validateName();
    if (!(email && pwd && name)) {
      return;
    }
    toggleBtnLoading(true);
    toggleFormInput(true);
    let result;
    try {
      await APIService.createAdminAccount(email, name, pwd);
      result = true;
    } catch (e) {
      result = false;
    }
    toggleBtnLoading(false);
    toggleFormInput(false);
    if (result) {
      displayAlert(true, "Category added");
      clearAllInput();
    } else {
      displayAlert(false, "Something went wrong");
    }
  });
});

function toggleFormInput(valid) {
  if (valid) {
    $("#emailInput").prop("disabled", true);
    $("#passwordInput").prop("disabled", true);
    $("#nameInput").prop("disabled", true);
  } else {
    $("#emailInput").prop("disabled", false);
    $("#passwordInput").prop("disabled", false);
    $("#nameInput").prop("disabled", false);
  }
}

function clearAllInput() {
  $("#nameInput").val("");
  $("#nameInput").removeClass("is-valid");
  $("#passwordInput").val("");
  $("#passwordInput").removeClass("is-valid");
  $("#emailInput").val("");
  $("#emailInput").removeClass("is-valid");
}

function toggleBtnLoading(loading) {
  if (loading) {
    $("#accountSubmit").prop("disabled", true);
    $("#accountSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Adding...");
    $("#loading-spinner").toggleClass("d-none");
  } else {
    $("#accountSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Add");
    $("#loading-spinner").toggleClass("d-none");
    $("#accountSubmit").prop("disabled", false);
  }
}

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

  if (!validator.isStrongPassword(input, { minSymbols: 0 })) {
    $("#passwordErrorMsg").text("Password not Strong enough");
    $("#passwordInput").addClass("is-invalid");
    return false;
  }

  $("#passwordInput").removeClass("is-invalid");
  return input;
}

function validateName() {
  const input = $("#nameInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#nameErrorMsg").text("Name can't be empty");
    $("#nameInput").addClass("is-invalid");
    return false;
  }

  if (!validator.isByteLength(input, { min: 3, max: 20 })) {
    $("#nameErrorMsg").text("Name must be between 3-20 character");
    $("#nameInput").addClass("is-invalid");
    return false;
  }

  $("#nameInput").removeClass("is-invalid");
  return input;
}
