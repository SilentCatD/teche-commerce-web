const item_per_page = 6;
const total_slider_item = 9;
const item_per_slider = 3;
const pagination_size = 3;

let currentPage = 1;
let totalPages;

$(document).ready(async function () {
  await REinit();
});

async function REinit() {
  let fetchResult = await shopController.fetchProduct(
    currentPage,
    item_per_page
  );
  await shopController.renderProductList(fetchResult.data["items"]);
  console.log(fetchResult.data["items"]);
  console.log(fetchResult.data["total-pages"]);
  // let fetchLatestProduct = await shopController.fetchLatestProduct(total_slider_item);
  // await shopController.renderProductSlider(fetchLatestProduct.data['items'])

  await shopController.renderPaginationPage(
    currentPage,
    fetchResult.data["total-pages"]
  );
}

const shopController = {
  fetchProduct: async function (page, limit) {
    try {
      let query = `limit=${limit}&page=${page}`;
      let request = {
        method: "get",
        url: `/api/v1/product?${query}`,
      };
      let res = await axios(request);
      return res;
    } catch (e) {
      console.log(e);
    }
  },
  fetchLatestProduct: async function (limit) {
    try {
      let query = `limit=${limit}&sort=createAt`;
      let request = {
        method: "get",
        url: `/api/v1/product?${query}`,
      };
      let res = await axios(request);
      return res;
    } catch (e) {
      console.log(e);
    }
  },
  renderPaginationPage: async function (currentPage, lastPage) {
    let size = 0;

    if (currentPage != 1) {
      $("#pagination").append(`<a href="#">◀</a>`);
    }

    for (let i = currentPage - pagination_size / 2; i < currentPage; i++) {
      if (i < 1) {
        size++;
        continue;
      }
      renderHTMLElement.renderPagination(i);
    }

    renderHTMLElement.renderPagination(currentPage);

    for (let i = currentPage + 1; i <= currentPage + pagination_size / 2; i++) {
      if (i > lastPage) break;
      renderHTMLElement.renderPagination(i);
    }

    if (currentPage != lastPage) {
      $("#pagination").append(`<a href="#">▶</a>`);
    }
  },
  renderProductList: async function (products) {
    products.forEach((product) => {
      $("#product-list").append(
        `<div class="col-lg-4 col-md-6 col-sm-6">
                ${renderHTMLElement.renderProductItem(product)}
                </div> 
                `
      );
    });
  },
  renderProductSlider: async function (products) {
    let loop = products.length / item_per_slider;
    let j = 0;
    for (let i = 0; i < products.length; i++) {
      if (i % item_per_slider == 0) {
        j++;
        $("#slider_latest_product").append(
          `<div class="latest-prdouct__slider__item" id="slider_latest_product_item_${j}">
                    </div>`
        );
      }
      $(`#slider_latest_product_item_${j}`).append(
        renderHTMLElement.renderSliderItem(products[i])
      );
    }
  },
  setPagination: async function () {
    $(".product__pagination");
  },
};

const renderHTMLElement = {
  renderProductItem: (product) => {
    return `<div class="product__item">
        <div class="product__item__pic set-bg" data-setbg=${product.images[0].firebaseUrl}
        style="background-image: url(${product.images[0].firebaseUrl});"
            >
            <ul class="product__item__pic__hover">
                <li><a href="#"><i class="fa fa-heart"></i></a></li>
                <li><a href="#"><i class="fa fa-retweet"></i></a></li>
                <li><a href="#"><i class="fa fa-shopping-cart"></i></a></li>
            </ul>
        </div>
        <div class="product__item__text">
            <h6><a href="detail?id=${product._id}">${product.name}</a></h6>
            <h5>$${product.price}</h5>
        </div>
    </div>`;
  },
  renderSliderItem(product) {
    return `<a href="#" class="latest-product__item">
        <div class="latest-product__item__pic">
            <img src=${product.images[0].firebaseUrl} alt="">
        </div>
        <div class="latest-product__item__text">
            <h6> ${product.name} </h6>
            <span>${product.price} </span>
        </div>
    </a>`;
  },
  renderPagination(page) {
    $("#pagination").append(`<a href="#">${page}</a>`);
  },
};
