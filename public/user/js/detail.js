
$(document).ready(async function () {
    await REinit();
  });
  
  async function REinit() {
    const searchParams = new URLSearchParams(window.location.search)
    
    const productId = searchParams.get('id');
    const fetchResult = await detailController.fetchProduct(productId);

    await detailController.renderProduct(fetchResult.data);
    console.log(fetchResult);
  }

const detailController = {
    fetchProduct: async(productId) =>{
            try {
              let request = {
                method: "get",
                url: `/api/v1/product/${productId}`,
              };
              let res = await axios(request);
              return res;
            } catch (e) {
              console.log(e);
            }
          
    },
    renderProduct: async(product) => {
        renderHTML.renderProductDetail(product);
    }

}

const renderHTML = {
    renderProductDetail: (product) => {
        $(".product__details__name").text(product.name);

        let numberOfReview = 0;
        for(let i = 0 ; i < product.rates.length; i++) {
            numberOfReview += product.rates[i];
        }
        $(".product__details__review").text(`(${numberOfReview} reviews)`);
        $(".product__details__price").text(product.price);
        $(".product__details__desc").text(product.details);
        if(product.inStock <= 0 ) {
            $(".product__details__avail").text("In Stock");

        } else {
            $(".product__details__avail").text("Out Stock");
        }
        $(".product__details__brand").text("Woof")


    },
    renderComment: {

    }

}