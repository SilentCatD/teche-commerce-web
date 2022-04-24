import APIService from "../../utils/api_service.js";
import { updateUserCart } from "./header.js";

const CART_INFO = {
    items: null,
    totalPrice : 0,
    length:0,
};

$(document).ready(async function () {
    setBreadCrumb("Shopping-cart", null);
    await REInit();

    $("#proceed-checkout").on("click",function(e) {
        if(CART_INFO.length <= 0) alert("Empty cart");
        else window.location.href="/checkout";
    })
        // assign button
        $(".inc").on("click",async function(e){
            e.preventDefault();
            const productId = $(this).parent().data("product-id");
            const cartItem = CART_INFO.items.find(element => element.productId._id == productId)
            let productInputAmount  = $(this).parent().find(".amount");
            $(`#item-error-${productId}`).text("");

            // if(productInputAmount.val() < cartItem.productId.inStock) {
            //     productInputAmount.val(parseFloat(productInputAmount.val()) + 1 );
            //     cartItem.amount+=1;
            // }

            try {
                const response = await APIService.increaseCartItem(productId); 
                productInputAmount.val(parseFloat(productInputAmount.val()) + 1 );
                cartItem.amount+=1;
            } catch(e) {
                $(`#item-error-${productId}`).text(e.message);
            }
    
            const oldPrice = parseFloat($(`#item-price-${productId}`).text().trim().substring(1));
            const newPrice = productInputAmount.val()*cartItem.productId.price;
            changeTotalPrice(productId,newPrice,newPrice-oldPrice);
        })
    
        $(".dec").on("click",async function(e){
            e.preventDefault();
            const productId = $(this).parent().data("product-id");
            const cartItem = CART_INFO.items.find(element => element.productId._id == productId)
            let productInputAmount  = $(this).parent().find(".amount");

            $(`#item-error-${productId}`).text("");
            
            if(productInputAmount.val() <=1) return;
            
            try {
                const response = await APIService.decreaseCartItem(productId); 
                productInputAmount.val(parseFloat(productInputAmount.val()) - 1 );
                cartItem.amount-=1;
            } catch(e) {
                $(`#item-error-${productId}`).text(e.message);
            }
            
            const oldPrice = parseFloat($(`#item-price-${productId}`).text().trim().substring(1));
            const newPrice = productInputAmount.val()*cartItem.productId.price;
            changeTotalPrice(productId,newPrice,newPrice-oldPrice);
        });
    
        $(".amount").on("change",async function(){
            const productId = $(this).parent().data("product-id");
            const cartItem = CART_INFO.items.find(element => element.productId._id == productId);
            const amount = $(this).val();
            if(amount <=0) {
                $(this).val(1);
                amount = 1; 
            }
            $(`#item-error-${productId}`).text("");
            // else if( amount >=cartItem.productId.inStock) $(this).val(cartItem.productId.inStock);
            try {
                const response = await APIService.updateCartItem(productId,amount);
                $(this).val(amount);
                cartItem.amount = amount;
            } catch (e) {
                $(`#item-error-${productId}`).text(e.message);
                $(this).val(cartItem.amount);
            }
    
            const oldPrice = parseFloat($(`#item-price-${productId}`).text().trim().substring(1));
            const newPrice = $(this).val()*cartItem.productId.price;
            changeTotalPrice(productId,newPrice,newPrice-oldPrice);
          });

        $('.icon_close').on("click",
            function() 
            {
             $('#removeCartItem').modal('show');
             $("#removeCartItemConfirm").data("product-id", $(this).data("product-id"));
            });

        $("#removeCartItemCancel").on("click",function(){
            $('#removeCartItem').modal('hide');
        })
        $(".close").click(function(){
            $('#removeCartItem').modal('hide');
        })

        $('#removeCartItemConfirm').on("click",async ()=>{
            try {
            const productId = $("#removeCartItemConfirm").data("product-id");
            await APIService.removeCartItem(productId);
            await updateUserCart();
            CART_INFO.length--;
            const totalPrice = parseFloat($(`#item-price-${productId}`).text().trim().substring(1));
            changeTotalPrice(null,null,-totalPrice);
            $(`#item-${productId}`).remove();
            $(`#item-error-${productId}`).remove();

            $('#removeCartItem').modal('hide');

            } catch (e) {
                $(".modal-body").text(e.msg);
            }
        });
})

async function REInit() {
    try {
    CART_INFO.items = (await APIService.getUserCart()).data.items;
    CART_INFO.length = CART_INFO.items.length;
    } catch(e) {
        console.log(e);
    }

    if(CART_INFO.items.length > 0){
        let totalPrice = 0;
        let renderItems = "";
        CART_INFO.items.forEach((item) => {
            renderItems+=renderCartItem(item);
            totalPrice += item.productId.price*item.amount;
        });
        $("#cart-items tbody").html(renderItems);
        CART_INFO.totalPrice = totalPrice;
        $(`#cart-total`).text(`$${totalPrice}.00`);
        $(`#sub-total`).text(`$${totalPrice}.00`);
    }
}


function changeTotalPrice(productId,newPrice,inc){
    $(`#cart-total`).text(`$${parseFloat($(`#cart-total`).text().trim().substring(1)) + inc}`);
    $(`#sub-total`).text(`$${parseFloat($(`#sub-total`).text().trim().substring(1)) + inc}`);
    $(`#item-price-${productId}`).text(`$${newPrice}`);
}
function renderCartItem(item) {
    return `<tr id="item-${item.productId._id}">
    <td class="shoping__cart__item" >
        <img src="${item.productId.images[0]}" style="background: gray; alt="">
        <h5>${item.productId.name}</h5>
    </td>
    <td class="shoping__cart__price">
        $${item.productId.price}
    </td>
    <td class="shoping__cart__quantity">
        <div class="quantity">
        <div class="pro-qty" data-product-id="${item.productId._id}" >
            <span class="dec qtybtn">-</span>
            <input class= "amount" type="number" value="${item.amount}">
            <span class="inc qtybtn">+</span>
        </div>
        </div>
    </td>
    <td id="item-price-${item.productId._id}" class="shoping__cart__total">
        $${item.productId.price * item.amount}
    </td>
    <td class="shoping__cart__item__close">
        <span class="icon_close" data-product-id="${item.productId._id}"></span>
    </td>
</tr>
<td class="text-nowrap py-0 text-danger" id="item-error-${item.productId._id}"></td>
`
}
