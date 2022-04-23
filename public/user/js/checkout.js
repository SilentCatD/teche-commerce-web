import APIService from "../../utils/api_service.js";

$(document).ready(async function () {
    setBreadCrumb("Checkout", null);


    $("#checkout").on("click", async (e) => {
        e.preventDefault();
        try {
            await APIService.createOrder(null);
        } catch (e) {
            console.log(e);
        }
    })
});
