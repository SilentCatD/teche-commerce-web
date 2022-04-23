import { goBackToLoginIfNotAdmin, sleep } from "../../utils/common.js";
import APIService from "../../utils/api_service.js";
import displayAlert from "../js/alert.js";

$(document).ready(async function () {
  await goBackToLoginIfNotAdmin();
  const userInfo = await APIService.userInfo();
  await sleep(50);
  if(userInfo.avatar){
    $('#userAvatar').attr('src', userInfo.avatar);
  }
  $("#edit-name").val(userInfo.name);
  $("#edit-email").prop("disabled", true);
  $('#userAvatarInput').change(function (e) { 
    e.preventDefault();
    validateAvatarFile();
  });
  $('#avatarSubmit').click(async function (e) { 
    e.preventDefault();
    const file = validateAvatarFile();
    if(!file) return;
    try{
      await APIService.userInfoEdit({imgFile: file});
      displayAlert(true, "user avatar updated")
    }catch(e){
      console.log(e);
      displayAlert(false, "can't update user avatar")
    }
  });
  $("#edit-name").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserName("edit-name", "edit-name-error");
  });

  $("#new-user-password").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserPassword("new-user-password", "edit-password-error");
  });

  $("#edit-info-submit").on("click", async function (e) {
    const isValidName = validateUserName("edit-name", "edit-name-error");
    if (isValidName) {
      const newUserInfo = {
        name: $("#edit-name").val(),
      };
      try {
        const res = await APIService.userInfoEdit(newUserInfo);
        displayAlert(true, "Edit user info success");
      } catch (e) {
        displayAlert(false, "Edit user info failed");
      }
    }
  });

  $("#edit-email").val(userInfo.email);

  $("#edit-password-submit").on("click", async function (e) {
    const isValidPassword = validateUserPassword(
      "new-user-password",
      "edit-password-error"
    );

    if (isValidPassword) {
      const newUserPassword = {
        oldPassword: $("#old-user-password").val().trim(),
        newPassword: $("#new-user-password").val().trim(),
      };
      try{
        const res = await APIService.userInfoEdit({oldPassword: newUserPassword.oldPassword, newPassword: newUserPassword.newPassword});
        displayAlert(true, 'Password changed');
      }catch(e){
        displayAlert(false, 'Something went wrong');
        $('#edit-password-error').text(e.message);
      }
    }
  });
  if(!userInfo.usePassword){
      // has password
      $("#old-user-password").prop("disabled", true);
      $("#old-user-password").val("");

  }
  $("#spinner").removeClass("show");
});

function validateAvatarFile(){
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

function validateUserName(elementId, elementNotifyError) {
  let name = $(`#${elementId}`).val().trim();
  if (validator.isEmpty(name, { ignore_whitespace: true })) {
    $(`#${elementNotifyError}`).text("Name Should Not Be Empty");
    return false;
  }
  if (!validator.isByteLength(name, { min: 3, max: 20 })) {
    $(`#${elementNotifyError}`).text("Name must in range [3, 20] characters");
    return false;
  }
  $(`#${elementNotifyError}`).text("");
  return name;
}

function validateUserPassword(elementId, elementNotifyError) {
  let password = $(`#${elementId}`).val().trim();
  if (validator.isEmpty(password, { ignore_whitespace: true })) {
    $(`#${elementNotifyError}`).text("Password Should Not Be Empty");
    return false;
  }
  if (!validator.isStrongPassword(password, { minSymbols: 0 })) {
    $(`#${elementNotifyError}`).text("Password Not Strong Enough");
    return false;
  }
  $(`#${elementNotifyError}`).text("");
  return password;
}

