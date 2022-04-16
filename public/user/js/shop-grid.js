import APIService from "../../utils/api_service.js";

let pageConfiguration = {
  currentPage: 1,
  totalPage: -1,
  reRenderPagination: true,

  orderOption: "desc",
  sortOption: "createdAt",
  totalItems: -1,
  itemInPage: -1,
  query: "",
  item_per_page: 12,
  pagination_size: 5,

  total_slider_item: 9,
  item_per_slider: 3,
  categories: {},
  brands: {},
};

$(document).ready(async function () {
  await REinit();
  setBreadCrumb("Shop", null);
  $("#sortSelect").change(async function (e) {
    e.preventDefault();
    pageConfiguration.sortOption = $(this).val();
    await REinit();
  });

  $("#orderBySelect").change( async function (e) {
    e.preventDefault();
    pageConfiguration.orderOption = $(this).val();
    await REinit();
  });
  $('#searchBtn').click(async function (e) { 
    e.preventDefault(); 
    const query = $('#searchBox').val().trim();
    pageConfiguration.query = query;
    await REinit()
  });
  $('.filter_checkbox input').change(async function (e) { 
    e.preventDefault();
    let checked  = $(this).is(":checked");
    if(checked){
      $(this).parent().parent().addClass('sidebar__item__color');
    }else{
      $(this).parent().parent().removeClass('sidebar__item__color');
    }
    const type = $(this).attr('class');
    const id = $(this).attr('id');
    if(type=='brand'){
      if(id in pageConfiguration.brands){
        delete pageConfiguration.brands[id];
      }else{
        pageConfiguration.brands[id] = true;
      }
    }else if(type=='category'){
      if(id in pageConfiguration.categories){
        delete pageConfiguration.categories[id];
      }else{
        pageConfiguration.categories[id] = true;
      }
    }
    await REinit();
  });
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
        Math.floor((pageConfiguration.pagination_size - 1) / 2);
      i < pageConfiguration.currentPage;
      i++
    ) {
      if (i < 1) {
        lost++;
        continue;
      } else renderHTMLElement.renderPagination(i);
    }

    renderHTMLElement.renderPagination(pageConfiguration.currentPage);

    for (
      let i = pageConfiguration.currentPage + 1;
      i <=
      pageConfiguration.currentPage +
        Math.floor((pageConfiguration.pagination_size - 1) / 2) +
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
  renderProductList: function (products) {
      products.forEach((product) => {
      renderHTMLElement.renderProductItem(product);
    });
    $("#total-items-found").text(`${products.length}`);
  },
  renderProductSlider: async function (products) {
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
    let imgURL;
    if (product.images.length > 0) {
      imgURL = product.images[0];
    }
    $("#product-list").append(
      `<div class="col-lg-4 col-md-6 col-sm-6">
      <div class="product__item">
      <div class="product__item__pic set-bg" data-setbg=${imgURL}
      style="background: ${imgURL ? `url(${imgURL});` : "gray;"}"
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
  renderSliderItem(product, imageURL) {
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
      REinit();
    });
  },
  renderPaginationLeft() {
    $("#pagination").append(`<a id='move_left_page'>◀</a>`);
    $("#move_left_page").on("click", function () {
      pageConfiguration.currentPage = pageConfiguration.currentPage - 1;
      REinit();
    });
  },
  renderPaginationRight() {
    $("#pagination").append(`<a id='move_right_page'>▶</a>`);
    $("#move_right_page").on("click", function () {
      pageConfiguration.currentPage = pageConfiguration.currentPage + 1;
      REinit();
    });
  },
};
async function FetchProduct() {
  let response = await APIService.fetchAllProduct({
    page: pageConfiguration.currentPage,
    limit: pageConfiguration.item_per_page,
    sort: pageConfiguration.sortOption,
    order_by: pageConfiguration.orderOption,
    query: pageConfiguration.query,
    brands: Object.keys(pageConfiguration.brands),
    categories: Object.keys(pageConfiguration.categories),
  });
  let productsData = response;

  renderCompenent.renderProductList(productsData["items"]);

  pageConfiguration.currentPage = productsData["current-page"];
  pageConfiguration.totalPage = productsData["total-pages"];
  pageConfiguration.totalItems = productsData["total-items"];
}

function clearPage() {
  $("#pagination").empty();
  $("#product-list").empty();
}
