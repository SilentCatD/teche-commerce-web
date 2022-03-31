let show_eye;
let hide_eye;

$(document).ready(async function () {
    show_eye = $("#show_eye");
    hide_eye = $("#hide_eye");
    });

function password_show_hide() {
    const x = $("#userpwd");

    console.log(x.attr('type'));
    console.log(show_eye);
    console.log(hide_eye);


    if (x.attr("type") === "password") {
        x.attr("type","text");
        show_eye.css("display","none");
        hide_eye.css("display","block");
    } else {
        x.attr("type","password");
        show_eye.css("display","block");
        hide_eye.css("display","none");
    }
  }