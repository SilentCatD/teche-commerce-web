import APIService from "../../utils/api_service.js";

let pageConfiguration = {
  currentPage: 1,
  totalPage: -1,
  totalItems: -1,
  itemInPage: -1,
  item_per_page: 3,
  pagination_size: 5,

  //Sort
  orderOption: "desc",
  sortOption: "createdAt",
  query: query,
  categories: {},
  brands: {},
  minPrice: 0,
  maxPrice: 2000,
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

  $('.price-range').on('slidechange',async function (e, ui) { 
    e.preventDefault();
    const priceRange = ui.values;
    pageConfiguration.minPrice = priceRange[0];
    pageConfiguration.maxPrice = priceRange[1];
    await REinit();
  });

});

async function REinit() {
  $("#product-list").empty();
  await FetchProduct();
  renderCompenent.renderPaginationPage(pageConfiguration);
}

const renderCompenent = {
  renderPaginationPage: function () {
    const pages = [];
    let  generated= 0;
    let startAt = pageConfiguration.currentPage - Math.floor(5/2);
    let curr = startAt;
    if(pageConfiguration.currentPage!=1) {
      pages.push(`<a data-move-page ="left" class='page-item'>◀</a>`);
    }
    while (generated < pageConfiguration.pagination_size) {
      if (curr > pageConfiguration.totalPage) {
        startAt--;
        if(startAt<1) break;
        pages.splice(1, 0,
          `<a class="page-item"  href="#">${startAt}</a>`
        );
        generated++;
        continue;
      }
      if (curr > 0) {
        if (curr == pageConfiguration.currentPage) {
          pages.push(
            `<a class="page-item bg-info" href="#">${curr}</a>`
          );
        } else {
          pages.push(
            `<a  class="page-item" href="#">${curr}</a>`
          );
        }
        generated++;
      }
      curr++;
    }
    if(pageConfiguration.currentPage < pageConfiguration.totalPage) {
      pages.push(`<a data-move-page ="right" class='page-item' >▶</a>`);
    }
    $("#pagination-section").html(pages.join("\n"));
    $(".page-item").click(async function (e) {
      e.preventDefault();
      if($(this).data("move-page")=="left") {
        pageConfiguration.currentPage-=1;
      } else if($(this).data("move-page")=="right") {
        pageConfiguration.currentPage+=1;
      } else {
        pageConfiguration.currentPage = $(this).text().trim();
    }
    await REinit();
    });
  },
  renderProductList: function (products) {
      products.forEach((product) => {
      renderHTMLElement.renderProductItem(product);
    });
    $("#total-items-found").text(`${products.length}`);
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
    range_field: 'price',
    min: pageConfiguration.minPrice,
    max: pageConfiguration.maxPrice,
  });
  let productsData = response;

  renderCompenent.renderProductList(productsData["items"]);

  pageConfiguration.currentPage = productsData["current-page"];
  pageConfiguration.totalPage = productsData["total-pages"];
  pageConfiguration.totalItems = productsData["total-items"];
}

