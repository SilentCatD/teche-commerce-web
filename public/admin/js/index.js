import APIService from "../../utils/api_service.js";
import {
  sleep,
  goBackToLoginIfNotAdmin,
} from "../../utils/common.js";




$(document).ready(async function () {
  // Spinner
  await goBackToLoginIfNotAdmin(),
  await sleep(50);
  $("#spinner").removeClass("show");
});
