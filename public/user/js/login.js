
const API_CALL_1 = {
    loginRequest: async (email, password) => {
      try {
        const request = {
          method: "post",
          url: `/api/v1/auth/login`,
          data: {
              email: email,
              password: password
          }
        };
        let res = await axios(request);
        return res;
      } catch (e) {
        return e.response;
    } 
    },
  };
  

$("#login").bind("click", async () => {
    $("#error").text("");

    const email = $("#useremail").val();
    const password = $("#userpwd").val();

    const response = await API_CALL.loginRequest(email,password);
    console.log(response);
    if(response.status === 400) {
        // something fuckup validtor in backend
        $(".text-danger").text(response.data.errors[0].msg);
    } else if(response.status === 403) {
        // wrong password 
        $(".text-danger").text(response.data.msg);
    } else if(response.status === 200) {
        // success login, now real stuff begin
        authentication.sayHello();

         // what the hell is this (data.success)

        // step 1: extract jwt token (acess token and refresh token)
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;

        // step 2: save some where (seasionStorage)
        authentication.setJwtToken(accessToken);
        authentication.setRefreshToken(refreshToken);

        // step 3: redirect homePage customer or admin 
        const jwtToken = authentication.getJwtToken();
        if(jwtToken) {
          // step4: redirect to customer previous page (i dunnu how)
          console.log("Yes token have been save");
        }
    }
});



$("#useremail").on("input propertychange", function (e) {
    e.preventDefault();
    validateUserEmail();
  });


  $("#userpwd").on("input propertychange", function (e) {
    e.preventDefault();
  });

function validateUserEmail() {
    let email = $("#useremail").val().trim();
    if(!validator.isEmail(email)) {
        $("#error").text("Invalid Email format");
    }
}



function password_show_hide() {

    const show_eye = $("#show_eye");
    const hide_eye = $("#hide_eye");

    const x = $("#userpwd");

    console.log(x.attr('type'));
    console.log(show_eye);
    console.log(hide_eye);

    hide_eye.removeClass('d-none');
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

