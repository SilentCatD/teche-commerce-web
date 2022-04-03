import APIService from "../../utils/api_service.js";
import { cacheKey, sleep, clearCache } from "../../utils/common.js";
import TokenService from '../../utils/token_service.js';

$(document).ready(async function () {
  // Spinner
    const isAdmin = await APIService.isAdmin();
    if(!isAdmin){
        console.log(isAdmin);
        // clearCache('admin');
        // window.location.replace("/admin");
    }
    await sleep(50);
    $("#spinner").removeClass("show");
});
