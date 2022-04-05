import APIService from "../../utils/api_service.js";

$(document).ready(async function () {
  if (await APIService.haveTokens("user")) {
    try {
      const userInfo = await APIService.userInfo("user");
      $("#login-header").hide();
      $("#login-humberger").hide();
      $(".join-us").text("Click into icon to edit your profile");
      if (userInfo.name) {
        $(".user-name").html(`<i class='fa fa-user'></i>${userInfo.name}`);
      } else {
        $(".user-name").html(`<i class='fa fa-user'></i>???`);
      }
  
      $(".logout").on("click", async function () {
        await APIService.logout("user");
        window.location.reload();
      });
      console.log(userInfo);
    } catch (e) {
      console.log(e);
    }
  } else {
    $("#logout-header").hide();
    $("#logout-humberger").hide();
    $(".user-cart").hide();
    $(".join-us").html(
      "<a class='text-primary' href='signup'>Do you want join us <bold>Register Now!</bold></a>"
    );
    $(".header__top__left__edit").html("");
    $(".join-us").on("click", async function () {
      window.location.href = `/signup`;
    });
  }
});
