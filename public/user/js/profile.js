import APIService from "../../utils/api_service.js";
$(document).ready(async function() {

    $("#password_show_hide").on("click", function (e) {
        console.log("fuck");
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

      try {
        const userInfo = await APIService.userInfo("user");
    if(userInfo) {
        $(".alert").hide();
        $("#edit-name").val(userInfo.name);
        $("#edit-email").prop('disabled', true);
        if(userInfo.email) {
            $("#edit-email").val(userInfo.email);
        } else {
            $("#edit-email").val("Third party User");
        }

        $("#edit-submit").on("click", async function(e) {
            const newUserInfo = {
                name: $("#edit-name").val(),
            }
            const res = await APIService.userInfoEdit("user",newUserInfo);
            console.log(res);
            $(".alert").text(res);
            $(".alert").show();
            $(".alert").alert();
        })
    }
      } catch (e) {
        window.location.href = "/";
      }

    // console.log(userInfo);

    // const newUserInfo = {
    //     name: "Phạm Lê Mít",
    // }
    // const msg = await APIService.userInfoEdit("user",newUserInfo);

    // console.log(msg);
})
