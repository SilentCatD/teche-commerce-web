import APIService from "../../utils/api_service.js";

const CART_INFO = {
    items: null,
    totalPrice : 0,
};
$(document).ready(async function () {
    setBreadCrumb("Shopping-cart", null);
    CART_INFO.items = (await APIService.getUserCart()).data.items;

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
})

async function REInit() {
    // render
    if(CART_INFO.items.length > 0){
        let totalPrice = 0;
        CART_INFO.items.forEach((item) => {
            $("#cart-items tbody").append(renderCartItem(item));
            totalPrice += item.productId.price*item.amount;
        });
        CART_INFO.totalPrice = totalPrice;
    }
}


function changeTotalPrice(productId,newPrice,inc){
    console.log(newPrice);
    console.log(inc);
    $(`#total-price-${productId}`).text(`$${newPrice}`);
    $(`#cart-total`).text(`$${parseFloat($(`#cart-total`).text().trim().substring(1)) + inc}`);
    $(`#sub-total`).text(`$${parseFloat($(`#sub-total`).text().trim().substring(1)) + inc}`);
}
function renderCartItem(item) {
    return `<tr>
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
        <span class="icon_close" data-product-id="${item.productId.id}"></span>
    </td>
</tr>`
}
