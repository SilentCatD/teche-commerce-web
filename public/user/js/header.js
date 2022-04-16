import APIService from "../../utils/api_service.js";

$(document).ready(async function () {
  if (APIService.haveTokens("user")) {
    try {
      const userInfo = await APIService.userInfo();
      console.log(userInfo);
      $("#login-header").hide();
      $("#login-humberger").hide();
      $(".join-us").text("Click into icon to edit your profile");
      $(".user-name").html(`<i class='fa fa-user'></i>${userInfo.name} - ${userInfo.role}`);
      $('.user-name').click(function (e) { 
        e.preventDefault();
        window.location.href = '/profile';
      });
      $(".logout").on("click", async function () {
        await APIService.logout("user");
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    $('#header__order').hide();
    $("#logout-header").hide();
    $("#logout-humberger").hide();
    $(".user-cart").hide();
    $(".join-us").html(
      "<a class='text-primary' href='signup'>Do you want join us <bold>Register Now!</bold></a>"
    );
    $(".header__top__left__edit").html("");
    $(".join-us").on("click",function () {
      window.location.replace(`/signup`);
    });
  }
});
