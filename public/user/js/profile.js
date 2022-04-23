import APIService from "../../utils/api_service.js";
import { validateUserName, validateUserPassword } from "./utils/validate.js";
import {getUserInfo} from "./initialize.js";


$(document).ready(async function () {
  const userInfo = await getUserInfo();
  try {
    if (userInfo) {
      $(".alert").hide();
      $("#edit-name").val(userInfo.name);
      $("#edit-email").prop("disabled", true);


      $("#edit-name").on("input propertychange", function (e) {
        e.preventDefault();
        validateUserName("edit-name", "edit-name-error");
      });

      $("#edit-user-password").on("input propertychange", function (e) {
        e.preventDefault();
        validateUserPassword("edit-user-password", "edit-password-error");
      });


      $("#edit-info-submit").on("click", async function (e) {
        const isValidName = validateUserName("edit-name", "edit-name-error");
        if(isValidName) {
          const newUserInfo = {
            name: $("#edit-name").val(),
          };
          const res = await APIService.userInfoEdit(newUserInfo);
          showAlert(res);
        }  else {
          showAlert("You have some invalid field");
        }
      });

      if (userInfo.email) {
        $("#edit-email").val(userInfo.email);

        $("#edit-password-submit").on("click", async function (e) {
          const isValidPassword = validateUserPassword(
            "edit-user-password",
            "edit-password-error"
          );
  
          if(isValidPassword) {
            const newUserPassword = {
              verifyPassword: $("#user-password").val(),
              password: $("#edit-user-password").val(),
            };
            const res = await APIService.userInfoEdit(newUserPassword);
            showAlert(res);
          }
        });

      } else {
        $("#edit-email").val("Third party User");

        $(".password-input").attr("type","text");
        $(".password-input").val("Third party User");
        $(".password-input").prop("disabled", true);
      }

    }
  } catch (e) {
    window.location.replace('/login');
  }
});


function showAlert(message) {
  $(".alert").html(
    `<a class="panel-close close" data-dismiss="alert">×</a> 
    ${message}`
  );
  $(".alert").show();
  $(".alert").alert();
}
