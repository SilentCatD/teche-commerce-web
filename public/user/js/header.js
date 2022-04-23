import APIService from "../../utils/api_service.js";
import {getUserInfo} from"./initialize.js";



$(document).ready(async function () {
  const userInfo = await getUserInfo();
  if (userInfo) {
    try {
      await updateUserCart();
      $("#login-header").hide();
      $("#login-humberger").hide();
      $(".join-us").text("Click into icon to edit your profile");
      $(".user-name").html(`<i class='fa fa-user'></i>${userInfo.name} - ${userInfo.role}`);
      $('.user-name').click(function (e) { 
        e.preventDefault();
        window.location.href = '/profile';
      });
      $(".logout").hover(function(){
        $(this).css("cursor", "pointer");
      })
      $(".logout").on("click", async function () {
        await APIService.logout("user");
        window.location.reload();
      });
      $(".fa-shopping-bag").on("click",function() {
        window.location.href =  `/cart`;
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
export async function updateUserCart() {
  const cartInfo = await APIService.getUserCartInfo();
  console.log(cartInfo);
  $("#cart-total-price").text(`$${cartInfo.total}`);
  $("#cart-amount").text(cartInfo.amount);
}

