
$(document).ready(async function () {
  setBreadCrumb("Shop",product.name);
  await REinit();

  });
  
  async function REinit() {
    $('.product__details__name').text(product.name);
    $('.product__details__review').text(`(${product.rateCount} reviews)`);
    $('.product__details__price').text(`$${product.price}`);
    $('.product__details__desc').text(product.details);

    $("#product__details__avail").text(product.status);
    if(product.brand) {
      $('#product__details__brand').text(product.brand.name);
    } else {
      $('#product__details__brand').text("Unknown");
    }

    if(product.category) {
      $('#product__details__category').text(product.category.name);
    } else {
      $('#product__details__brand').text("Unknown");
    }


    product.rateAverage = 3.6;
    let ratingValue = product.rateAverage, rounded = (product.rateAverage | 0);
  
    for (let j = 0; j < 5 ; j++) {
      $(".product__details__rating__star").append('<i class="fa '+ ((j < rounded) ? "fa-star" : ((((ratingValue - j) > 0) && ((ratingValue - j) < 1)) ? "fa-star-half-o" : "fa-star-o")) +'" aria-hidden="true"></i>');
    }
  
  }

const detailController = {
    renderProduct: async(product) => {
        renderHTML.renderProductDetail(product);
    }

}
