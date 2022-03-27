let productsImages = [];

$(document).ready(function () {
  $(".owl-carousel").owlCarousel();
  $("#file-input").change(function (e) {
    e.preventDefault();
    console.log('changed');
    const result = validateProductsImg();
    if (result) {
      renderProductsCarousel();
    }
  });
  bindCarousel();
});

function bindCarousel() {
  $(".add-image-btn").click(function (e) {
    e.preventDefault();
    $("#file-input").trigger("click");
  });
}

function validateProductsImg() {
  const file = $("#file-input").prop("files")[0];
  if (!file) return false;
  const mineType = file.type;
  const accept_types = ["image/jpeg", "image/png"];
  if (!accept_types.includes(mineType)) {
    return false;
  }
  productsImages.push(file);
  return true;
}

function renderProductsCarousel() {
console.log(productsImages.length);
  if (productsImages.length == 0) {
  } else {
    for (let i = 0; i < productsImages.length; i++) {
      const src = URL.createObjectURL(productsImages[i]);
      $("#productImagesCarousel .carousel-indicators").append(
        `<button type="button" data-bs-target="#productImagesCarousel" data-bs-slide-to="${i+1}"></button>`
      );
      $("#productImagesCarousel .carousel-inner").append(`
        <div class="carousel-item">
            <div class="image-item"><img src="${src}"></div>
            <div class="carousel-caption">
                <button class="add-image-btn btn btn-danger rounded-circle m-2"><i class="fa-solid fa-trash-can"></i></button>
                <button class="add-image-btn btn btn-primary rounded-circle m-2"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
        `);
    }
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
