import APIService from "../../utils/api_service.js";
import { validateUserName, validateUserPassword } from "./utils/validate.js";
import { getUserInfo } from "./initialize.js";

$(document).ready(async function () {
  const userInfo = await getUserInfo();
  try {
    if (userInfo) {
      $(".alert").hide();
      $("#edit-name").val(userInfo.name);
      $("#edit-email").prop("disabled", true);
      if (userInfo.avatar) {
        $("#userAvatar").attr("src", userInfo.avatar);
      }
      $("#userAvatarInput").change(function (e) {
        e.preventDefault();
        validateAvatarFile();
      });
      $("#avatarSubmit").click(async function (e) {
        e.preventDefault();
        const file = validateAvatarFile();
        if (!file) return;
        try {
          await APIService.userInfoEdit({ imgFile: file });
          showAlert("Image edit success");
        } catch (e) {
          console.log(e);
          showAlert("Image edit failed");
        }
      });
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
        if (isValidName) {
          const newUserName = $("#edit-name").val();
          const res = await APIService.userInfoEdit({ name: newUserName });
          showAlert("Name edit success");
        } else {
          showAlert("Invalid field name");
        }
      });
      $("#edit-email").val(userInfo.email);
      if (userInfo.usePassword) {
        $("#edit-password-submit").on("click", async function (e) {
          const isValidPassword = validateUserPassword(
            "edit-user-password",
            "edit-password-error"
          );
          if (!isValidPassword) return;
          const oldPassword = $("#user-password").val();
          const password = $("#edit-user-password").val();
          try{
            const res = await APIService.userInfoEdit({
              oldPassword: oldPassword,
              newPassword: password,
            });
            showAlert("password changed");
          }catch(e){
            showAlert(e.message);
          }
          
        });
      } else {
        $(".password-input").attr("type", "text");
        $(".password-input").val("");
        $(".password-input").prop("disabled", true);
      }
    }else{
      window.location.replace("/");
    }
  } catch (e) {
    window.location.replace("/login");
  }
});

function showAlert(message) {
  $(".alert").html(
    `<a class="panel-close close" onClick="$('.alert').hide()" >×</a> 
    ${message}`
  );
  $(".alert").show();
  $(".alert").alert();
}

function validateAvatarFile() {
  const file = $("#userAvatarInput").prop("files")[0];
  if (!file) return;
  const mineType = file.type;
  const accept_types = ["image/jpeg", "image/png"];
  if (!accept_types.includes(mineType)) {
    return false;
  }
  const src = URL.createObjectURL(file);
  $("#userAvatar").attr("src", src);
  return file;
}
