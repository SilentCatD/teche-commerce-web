import APIService from "../../utils/api_service.js";

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
    history.back();
  } catch (err) {
    $(".text-danger").text(err.message);
  }
});


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
