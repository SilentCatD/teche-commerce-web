let pageConfiguration = {
  currentPage: 1,
  totalPage: -1,

  totalItems: -1,
  itemInPage: -1,

  item_per_page: 3,
  total_slider_item: 9,
  item_per_slider: 3,
  pagination_size: 5,
};

$(document).ready(async function () {
  await REinit();
  window.history.replaceState(pageConfiguration,"","");
});

async function REinit() {
  clearPage();

  await FetchProduct();

  // await fetchLatestProduct()

  await renderCompenent.renderPaginationPage(pageConfiguration);

  $(`#pagination_${pageConfiguration.currentPage}`).css({
    color: "blue",
    "border-color": "blue",
  });
}

const API_CALL = {
  fetchProduct: async (page, limit) => {
    
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
  fetchLatestProduct: async (limit) => {
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
};

const renderCompenent = {
  renderPaginationPage: async function (pageConfiguration) {
    if (pageConfiguration.currentPage != 1) {
      renderHTMLElement.renderPaginationLeft();
    }

    let lost = 0;

    for (
      let i =
        pageConfiguration.currentPage -
        Math.floor(pageConfiguration.pagination_size / 2);
      i < pageConfiguration.currentPage;
      i++
    ) {
      if (i < 1) {
        lost++;
        continue;
      }
      renderHTMLElement.renderPagination(i);
    }

    renderHTMLElement.renderPagination(pageConfiguration.currentPage);

    for (
      let i = pageConfiguration.currentPage + 1;
      i <=
      pageConfiguration.currentPage +
        Math.floor(pageConfiguration.pagination_size / 2) +
        lost;
      i++
    ) {
      if (i > pageConfiguration.totalPage) break;
      renderHTMLElement.renderPagination(i);
    }

    if (pageConfiguration.currentPage != pageConfiguration.totalPage) {
      renderHTMLElement.renderPaginationRight();
    }
  },
  renderProductList: async function (products) {
    products.forEach((product) => {
      if(product.images.length==0) {
        renderHTMLElement.renderProductItem(product,"https://pbs.twimg.com/media/EpYWByzUUAAvuZh.jpg");
      } else {
        renderHTMLElement.renderProductItem(product,product.images[0]);
      }
    });
    $("#total-items-found").text(`${products.length}`);
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
  renderProductItem: (product,imgURL) => {
    $("#product-list").append(
      `<div class="col-lg-4 col-md-6 col-sm-6">
      <div class="product__item">
      <div class="product__item__pic set-bg" data-setbg=${imgURL}
      style="background-image: url(${imgURL});"
          >
          <ul class="product__item__pic__hover">
              <li><a href="#"><i class="fa fa-heart"></i></a></li>
              <li><a href="#"><i class="fa fa-retweet"></i></a></li>
              <li><a href="#"><i class="fa fa-shopping-cart"></i></a></li>
          </ul>
      </div>
      <div class="product__item__text">
          <h6><a href="details/${product.id}">${product.name}</a></h6>
          <h5>$${product.price}</h5>
      </div>
  </div>
</div> `
    );
  },
  renderSliderItem(product,imageURL) {
    return `<a href="#" class="latest-product__item">
        <div class="latest-product__item__pic">
            <img src=${imageURL} alt="">
        </div>
        <div class="latest-product__item__text">
            <h6> ${product.name} </h6>
            <span>${product.price} </span>
        </div>
    </a>`;
  },
  renderPagination(page) {
    $("#pagination").append(`<a  id="pagination_${page}">${page}</a>`);
    $(`#pagination_${page}`).on("click", function () {
      pageConfiguration.currentPage = page;
      window.history.pushState(
        pageConfiguration,"",""
      );
      REinit();
    });
  },
  renderPaginationLeft(){
    $("#pagination").append(`<a id='move_left_page'>◀</a>`);
    $("#move_left_page").on("click", function () {
      window.history.replace(
        pageConfiguration
      );
      pageConfiguration.currentPage = pageConfiguration.currentPage - 1;
      REinit();
    });
  }, 
  renderPaginationRight(){
    $("#pagination").append(`<a id='move_right_page'>▶</a>`);
    $("#move_right_page").on("click", function () {
      window.history.pushState(
        pageConfiguration,"",""
      );
      pageConfiguration.currentPage = pageConfiguration.currentPage + 1;
      REinit();
    });
  }
};
async function FetchProduct() {
  let fetchResult = await API_CALL.fetchProduct(
    pageConfiguration.currentPage,
    pageConfiguration.item_per_page
  );
  
  console.log(fetchResult);

  await renderCompenent.renderProductList(fetchResult.data["items"]);

  pageConfiguration.currentPage = fetchResult.data["current-page"];
  pageConfiguration.totalPage = fetchResult.data["total-pages"];
  pageConfiguration.totalItems = fetchResult.data["total-items"];
}

function clearPage() {
  $("#pagination").empty();
  $("#product-list").empty();
}

window.onpopstate = function (event) {
  if (event.state) {
    pageConfiguration = event.state;
    REinit();
  }
};
