import {whereAmI} from "/user/js/test-module.mjs";

$(document).ready(async function () {
    console.log(whereAmI());
    $(`#header__${whereAmI()}`).addClass("active");
  });
  