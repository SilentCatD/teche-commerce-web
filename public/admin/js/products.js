let productsImages = [];
let currentCarousel;
$(document).ready(function () {
  $(".owl-carousel").owlCarousel();
  $("#file-input").change(function (e) {
    e.preventDefault();
    const result = validateProductsImg();
    if (result) {
      renderProductsCarousel();
    }
  });
  bindCarousel();
});

function bindCarousel() {
  $(".add-image-btn")
    .unbind("click")
    .click(function (e) {
      e.preventDefault();
      addProductImages(this);
    });
  $(".rm-image-btn")
    .unbind("click")
    .click(function (e) {
      e.preventDefault();
      removeProductImages(this);
    });
}

function addProductImages(el) {
console.log(el);
  const index = $(el).data("img-index");
  console.log(index);
  currentCarousel = index;
  $("#file-input").trigger("click");
}

function removeProductImages(el) {
  const index = $(el).data("img-index");
  currentCarousel = index-1;
  if(currentCarousel<=0) currentCarousel = 0;
  productsImages.splice(index, 1);
  renderProductsCarousel();
}

function validateProductsImg() {
  const file = $("#file-input").prop("files")[0];
  $("#file-input").val("");
  if (!file) return false;
  const mineType = file.type;
  const accept_types = ["image/jpeg", "image/png"];
  if (!accept_types.includes(mineType)) {
    return false;
  }
  productsImages.splice(currentCarousel+1, 0, file);
  return true;
}

function renderProductsCarousel() {
  if (productsImages.length == 0 || productsImages.length == 1) {
    $("#productImagesCarousel .carousel-indicators").addClass("d-none");
    $("#productImagesCarousel .carousel-control-prev").addClass("d-none");
    $("#productImagesCarousel .carousel-control-next").addClass("d-none");
  } else {
    $("#productImagesCarousel .carousel-indicators").removeClass("d-none");
    $("#productImagesCarousel .carousel-control-prev").removeClass("d-none");
    $("#productImagesCarousel .carousel-control-next").removeClass("d-none");
  }
  if (productsImages.length == 0) {
    $("#productImagesCarousel .carousel-indicators").html('');
    $("#productImagesCarousel .carousel-inner").html(
      `
        <div class="carousel-item active">
            <div class="image-item carousel-holder"></div>
            <div class="carousel-caption">
                <button data-img-index="0" class="add-image-btn btn btn-primary rounded-circle m-2"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div> 
    `
    );
  } else {
    const carouselItems = [];
    const carouselIndicators = [];
    for (let i = 0; i < productsImages.length; i++) {
      const src = URL.createObjectURL(productsImages[i]);
      const carouselItem = `
          <div class="carousel-item ${i == currentCarousel ? "active" : ""}">
              <div class="image-item"><img src="${src}"></div>
              <div class="carousel-caption">
                  <button data-img-index="${i}" class="rm-image-btn btn btn-danger rounded-circle m-2"><i class="fa-solid fa-trash-can"></i></button>
                  <button data-img-index="${i}" class="add-image-btn btn btn-primary rounded-circle m-2"><i class="fa-solid fa-plus"></i></button>
              </div>
          </div> 
        `;
      const indicator = `
        <button type="button" data-bs-target="#productImagesCarousel" data-bs-slide-to="${i}" ${
        i == currentCarousel ? 'class="active"' : ""
      }"></button>
        `;
      carouselItems.push(carouselItem);
      carouselIndicators.push(indicator);
    }
    $("#productImagesCarousel .carousel-inner").html(carouselItems.join("\n"));
    $("#productImagesCarousel .carousel-indicators").html(
      carouselIndicators.join("\n")
    );
  }
  bindCarousel();
}

getItemsMethods = async (limit, page) => {
  return axios({
    method: "get",
    url: `/api/v1/brand?limit=${limit}&page=${page}`,
  });
};

setLimit = () => {
  return 12;
};

setDisplayPage = () => {
  return 5;
};

initialPage = () => {
  return 1;
};

renderTableHead = () => {
  return `<tr>
    <th scope="col">ID</th>
    <th scope="col">Brand Name</th>
    <th scope="col">Brand Image</th>
    <th scope="col">Number of products</th>
    <th scope="col">Ranking Points</th>
    <th scope="col">Created At</th>
    <th scope="col">&nbsp;</th>
    </tr>
    `;
};

renderTableRow = (item) => {
  return `<tr>
    <td class="align-middle">${item._id}</td>
    <td class="align-middle">${item.name}</td>
    <td class="align-middle">${
      item.images.length > 0
        ? `<img src=${item.images[0].firebaseUrl} style="max-width:100px;max-height:100px; object-fit: contain;">`
        : "Not avalable"
    }</td>
    <td class="align-middle">${item.productsHold}</td>
    <td class="align-middle">${item.rankingPoints}</td>
    <td class="align-middle">${item.createdAt}</td>
    <td class="align-middle">
    <div class="dropdown position-static">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          Manage
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><button class="manage-btn dropdown-item btn"  data-id='${
            item._id
          }' data-op='remove'>Edit</button></li>
          <li class="dropdown-divider"></li>
          <li><button class="manage-btn dropdown-item text-danger btn" data-id='${
            item._id
          }' data-op="edit">Remove</button></li>
        </ul>
      </div>
  </td>
  </tr>
  `;
};

bindRowAction = () => {
  $(".manage-btn").click(function (e) {
    e.preventDefault();
    const id = $(this).attr("data-id");
    const op = $(this).attr("data-op");
    // call func here
    $("#page-modal").modal("show");
  });
};

setTableName = () => {
  return "Products";
};
