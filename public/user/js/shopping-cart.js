import APIService from "../../utils/api_service.js";

const CART_INFO = {
    items: null,
    totalPrice : 0,
};
$(document).ready(async function () {
    setBreadCrumb("Shopping-cart", null);
    await REInit();

        // assign button
        $(".inc").click(function(e){
            e.preventDefault();
            const productId = $(this).parent().data("product-id");
            const cartItem = CART_INFO.items.find(element => element.productId._id == productId)
            let productInputAmount  = $(this).parent().find(".amount");
            
            if(productInputAmount.val() >= cartItem.productId.inStock) {
                $(".inc").prop('disabled',true);
            } else {
                productInputAmount.val(parseFloat(productInputAmount.val()) + 1 );
                cartItem.amount+=1;
                $(".inc").prop('disabled',false);
            }
    
            const oldPrice = parseFloat($(`#total-price-${productId}`).text().trim().substring(1));
            const newPrice = productInputAmount.val()*cartItem.productId.price;
            changeTotalPrice(productId,newPrice,newPrice-oldPrice);
        })
    
        $(".dec").click(function(e){
            e.preventDefault();
            const productId = $(this).parent().data("product-id");
            const cartItem = CART_INFO.items.find(element => element.productId._id == productId)
            let productInputAmount  = $(this).parent().find(".amount");
            if(productInputAmount.val() <= 1) {
                $(".dec").prop('disabled',true);
            } else {
                productInputAmount.val(parseFloat(productInputAmount.val()) - 1 );
                cartItem.amount-=1;
                $(".dec").prop('disabled',false);
            }
            const oldPrice = parseFloat($(`#total-price-${productId}`).text().trim().substring(1));
            const newPrice = productInputAmount.val()*cartItem.productId.price;
            changeTotalPrice(productId,newPrice,newPrice-oldPrice);
        })
    
        $(".amount").change(function(){
            const productId = $(this).parent().data("product-id");
            const cartItem = CART_INFO.items.find(element => element.productId._id == productId);
            
            const amount = $(this).val();
            if(amount <=0) $(this).val(1);
            else if( amount >=cartItem.productId.inStock) $(this).val(cartItem.productId.inStock);
    
            const oldPrice = parseFloat($(`#total-price-${productId}`).text().trim().substring(1));
            const newPrice = amount*cartItem.productId.price;
            changeTotalPrice(productId,newPrice,newPrice-oldPrice);
          });

        $('.icon_close').click(
            function() 
            {
             $('#removeCartItem').modal('show');
             $("#removeCartItemConfirm").data("product-id", $(this).data("product-id"));
            });

        $("#removeCartItemCancel").click(function(){
            $('#removeCartItem').modal('hide');
        })
        $(".close").click(function(){
            $('#removeCartItem').modal('hide');
        })

        $('#removeCartItemConfirm').click(async ()=>{
            try {
            const productId = $("#removeCartItemConfirm").data("product-id");
            console.log(productId);
            await APIService.removeCartItem(productId);
            const totalPrice = parseFloat($(`#total-price-${productId}`).text().trim().substring(1));
            changeTotalPrice(null,null,-totalPrice);
            $(`#item-${productId}`).remove();
            $('#removeCartItem').modal('hide');
            
            } catch (e) {
                $(".modal-body").text(e.msg);
            }
        });
})

async function REInit() {
    CART_INFO.items = (await APIService.getUserCart()).data.items;
    // render
    console.log(CART_INFO)
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
    $(`#total-price-${productId}`).text(`$${newPrice}`);
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
            <input class= "amount" type="input" value="${item.amount}">
            <span class="inc qtybtn">+</span>
        </div>
        </div>
    </td>
    <td id="total-price-${item.productId._id}" class="shoping__cart__total">
        $${item.productId.price * item.amount}
    </td>
    <td class="shoping__cart__item__close">
        <span class="icon_close" data-product-id="${item.productId._id}"></span>
    </td>
</tr>`
}
