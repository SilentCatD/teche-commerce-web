
$(document).ready(async function () {
// display rating
  product.rateAverage = 3.6;
  let ratingValue = product.rateAverage, rounded = (product.rateAverage | 0);

  for (let j = 0; j < 5 ; j++) {
    $(".product__details__rating__star").append('<i class="fa '+ ((j < rounded) ? "fa-star" : ((((ratingValue - j) > 0) && ((ratingValue - j) < 1)) ? "fa-star-half-o" : "fa-star-o")) +'" aria-hidden="true"></i>');
  }  
    await REinit();

  });
  
  async function REinit() {
    console.log(product)
    
  }

const detailController = {
    renderProduct: async(product) => {
        renderHTML.renderProductDetail(product);
    }

}

const renderHTML = {
    renderProductDetail: (product) => {

    },
    renderComment: {

    }

}