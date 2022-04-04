import APIService from "../../utils/api_service.js"; 

$(document).ready(async function () {
try {
  const userInfo = await APIService.userInfo("user");
  $("#login-header").hide();
  $("#login-humberger").hide();
  $(".join-us").text("Click into icon to edit your profile");
  if(userInfo.name) {
    $(".user-name").html(`<i class='fa fa-user'></i>${userInfo.name}`);
  } else {
    $(".user-name").html(`<i class='fa fa-user'></i>DaFuk???`);
  }

  $(".logout").on("click",async function() {
        await APIService.logout("user");
        window.location.reload();
    });

  // $(".user-name").on("click",async function() {
  //     window.location.href = "/profile";
  // });

  console.log(userInfo);
} catch (e) {
  console.log(e);
  $("#logout-header").hide();
  $("#logout-humberger").hide();
  $(".user-cart").hide();
  $(".join-us").html("<a class='text-primary' href='signup'>Do you want join us <bold>Register Now!</bold></a>")
  $(".user-name").html("");
  $(".join-us").on("click",async function() {
    const host = window.location.host;
    window.location.href = `http://${host}/signup`;
  })
}
})
  
  