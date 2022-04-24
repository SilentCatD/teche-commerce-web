import APIService from "../../utils/api_service.js";
import {validateStringField} from "./utils/validate.js";
import {getUserInfo} from"./initialize.js";


$(document).ready(async function () {
    setBreadCrumb("Checkout", null);    
    const response = await APIService.getUserCart();
    const userCart = response.data;
    const userInfo = await getUserInfo();
    let itemsHTML = "";
    let totalPrice = 0;
    for(let i = 0; i < userCart.items.length;i++){
        let item = userCart.items[i];
        totalPrice += item.total;
        itemsHTML+=`<div class="d-flex justify-content-between"> <span class="font-weight-bold">${item.productId.name}(Qty:${item.amount})</span> <span class="text-muted">$${item.total}</span> </div>`;
        $("#detail-cart-items").append(`
        <li>${item.productId.name}<span>$${item.total} (${item.amount})</span></li>
        `);
    }
    $("#subTotal").text(`$${totalPrice}`);
    $("#totalPrice").text(`$${totalPrice}`);
    
    $("#checkout").on("click", async (e) => {
        e.preventDefault();
        const firstName = validateStringField("firstName", "firstName-error",3,20);
        const lastName = validateStringField("lastName", "lastName-error",3,20);
        const country = validateStringField("country", "country-error",1,30);
        const address =validateStringField("address", "address-error",1,30);
        const townCity = validateStringField("townCity", "townCity-error",1,30);
        const postCode = validateStringField("postCode", "postCode-error",1,10);
        const phone = validateStringField("phone", "phone-error",9,12);
        const note = validateStringField("note", "note-error",0,256);


        if(firstName && lastName && country && address && townCity && postCode
            && phone && (note || note==="")) {
                try {
                    const delivery = {firstName,lastName,country,address,townCity,
                    postCode,phone};
                    if(note) {
                        delivery.note = note;
                    }
                    await APIService.createOrder(delivery);
                    modalCheckoutSuccess(userInfo,totalPrice,itemsHTML);
                    $("#order-notificate").modal("show");

                } catch (e) {
                    alert(e.message);
                    console.log(e);
                }
            }
        })
});

function modalCheckoutSuccess(userInfo,totalPrice,itemsHTML){
    console.log(userInfo);
    $("#modal-content").append(
        ` <h5 class="text-uppercase" id="user-name">${userInfo.name}</h5>
        <h4 class="mt-5 theme-color mb-5">Thanks for your order</h4> <span class="theme-color">Payment Summary</span>
        <div class="mb-3">
            <hr class="new1">
        </div>
        `
    );
    $("#modal-content").append(itemsHTML);
    $("#modal-content").append(
        `<div class="d-flex justify-content-between mt-3"> <span class="font-weight-bold">Total</span> <span class="font-weight-bold theme-color">${totalPrice}</span> </div>
        <div class="text-center mt-5"> <button class="btn btn-primary" id="btn-handle-event">Thank</button> </div>
        `
    );


}

$(".close").on("click",function(e){
    $("#order-notificate").modal("hide");
})
$("#firstName").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("firstName", "firstName-error",3,20);
    });

$("#lastName").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("lastName", "lastName-error",3,20);
  });

  $("#country").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("country", "country-error",1,30);
  });

  $("#address").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("address", "address-error",1,30);
  });

  $("#townCity").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("townCity", "townCity-error",1,30);
  });

  $("#postCode").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("postCode", "postCode-error",1,10);
  });

  $("#phone").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("phone", "phone-error",9,12);
  });

  $("#note").on("input propertychange", function (e) {
    e.preventDefault();
    validateStringField("note", "note-error",0,256);
  });