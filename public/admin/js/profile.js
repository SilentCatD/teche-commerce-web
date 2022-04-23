import { goBackToLoginIfNotAdmin, sleep } from "../../utils/common.js";


$(document).ready(async function () {
    await goBackToLoginIfNotAdmin();
    await sleep(50);
    $("#spinner").removeClass("show");
});