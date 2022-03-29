let productsImages = [];
let currentCarousel;
$(document).ready(function () {
  $("#file-input").change(function (e) {
    e.preventDefault();
    const result = validateProductsImg();
    if (result) {
      currentCarousel++;
      if (currentCarousel > productsImages.length - 1) {
        currentCarousel = productsImages.length - 1;
      }
      renderProductsCarousel();
    }
  });

  $("#addProductAccordion").on("show.bs.collapse", async function (e) {
    $("#product-add-section").addClass("loading");
    await renderBrandsAndCategories();
    $("#product-add-section").removeClass("loading");
  });

  $("#productSubmit").click(async function (e) {
    e.preventDefault();
    const name = validateProductNameInput();
    const price = validateProductPriceInput();
    const unit = validateUnitInput();
    const brand = validateProductBrandSelect();
    const category = validateProductCategorySelect();
    const description = validateProductDescription();
    if (
      name === false ||
      price === false ||
      unit === false ||
      brand === false ||
      category === false ||
      description === false
    ) {
      return;
    }
    toggleBtnLoading(true);
    toggleFormInput(true);
    const result = await createProduct(name, description, price, unit, brand, category);
    toggleBtnLoading(false);
    toggleFormInput(false);
    if (result) {
      console.log("hi");
      displayAlert(true, "Product added");
      clearAllInput();
    } else {
      displayAlert(false, "Something went wrong");
    }
  });

  $("#productNameInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateProductNameInput();
  });

  $("#productPriceInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateProductPriceInput();
  });

  $("#productPriceInput").keydown(function (e) {
    var invalidChars = ["-", "+", "e"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  });

  $("#productUnitInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateUnitInput();
  });

  $("#productUnitInput").keydown(function (e) {
    var invalidChars = ["-", "+", "e", "."];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  });

  $("#brandSelect").change(function (e) {
    e.preventDefault();
    validateProductBrandSelect();
  });

  $("#categorySelect").change(function (e) {
    e.preventDefault();
    validateProductCategorySelect();
  });

  bindCarousel();
  deleteDocumentOnClick("Product",deleteProduct);
});

async function createProduct(
  productName,
  productDetails,
  productPrice,
  productUnit,
  productBrand,
  productCategory
) {
  let formData = new FormData();
  formData.append("productName", productName);
  formData.append("productDetails", productDetails);
  formData.append("productPrice", productPrice);
  formData.append("productUnit", productUnit);
  formData.append("productBrand", productBrand);
  formData.append("productCategory", productCategory);
  productsImages.forEach((file) => {
    formData.append("images", file);
  });
  try {
    let response = await axios({
      method: "post",
      url: "/api/v1/product",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function clearAllInput() {
  $("#productNameInput").val("");
  $("#formFile").val("");
  $("#productDescription").val("");
  $("#productPriceInput").val("");
  $("#productUnitInput").val("");
  $("#brandSelect").val("default");
  $("#categorySelect").val("default");

  $("#productNameInput").removeClass("is-valid");
  $("#productPriceInput").removeClass("is-valid");
  $("#productUnitInput").removeClass("is-valid");
  $("#brandSelect").removeClass("is-valid");
  $("#categorySelect").removeClass("is-valid");
  currentCarousel = 0;
  productsImages = [];
  renderProductsCarousel();
}

function toggleBtnLoading(loading) {
  if (loading) {
    $("#productSubmit").prop("disabled", true);
    $("#productSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Adding...");
    $("#loading-spinner").toggleClass("d-none");
  } else {
    $("#productSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Add");
    $("#loading-spinner").toggleClass("d-none");
    $("#productSubmit").prop("disabled", false);
  }
}

function toggleFormInput(valid) {
  if (valid) {
    $(".rm-image-btn").prop("disabled", true);
    $(".add-image-btn").prop("disabled", true);
    $("#productNameInput").prop("disabled", true);
    $("#formFile").prop("disabled", true);
    $("#productDescription").prop("disabled", true);
    $("#productPriceInput").prop("disabled", true);
    $("#productUnitInput").prop("disabled", true);
    $("#brandSelect").prop("disabled", true);
    $("#categorySelect").prop("disabled", true);
  } else {
    $(".rm-image-btn").prop("disabled", false);
    $(".add-image-btn").prop("disabled", false);
    $("#productNameInput").prop("disabled", false);
    $("#formFile").prop("disabled", false);
    $("#productDescription").prop("disabled", false);
    $("#productPriceInput").prop("disabled", false);
    $("#productUnitInput").prop("disabled", false);
    $("#brandSelect").prop("disabled", false);
    $("#categorySelect").prop("disabled", false);
  }
}

function validateProductDescription() {
  const input = $("#productDescription").val();
  return input;
}

function validateProductBrandSelect() {
  const selected = $("#brandSelect").val().trim();
  if (selected == "default") {
    $("#productBrandErrorMsg").text("Please choose a brand for this product");
    $("#brandSelect").removeClass("is-valid");
    $("#brandSelect").addClass("is-invalid");
    return false;
  }
  $("#brandSelect").removeClass("is-invalid");
  $("#brandSelect").addClass("is-valid");
  return selected;
}

function validateProductCategorySelect() {
  const selected = $("#categorySelect").val().trim();
  if (selected == "default") {
    $("#productCategoryErrorMsg").text(
      "Please choose a brand for this product"
    );
    $("#categorySelect").removeClass("is-valid");
    $("#categorySelect").addClass("is-invalid");
    return false;
  }
  $("#categorySelect").removeClass("is-invalid");
  $("#categorySelect").addClass("is-valid");
  return selected;
}

function validateUnitInput() {
  const input = $("#productUnitInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#productUnitErrorMsg").text(
      "Product unit can't be empty or contain special character"
    );
    $("#productUnitInput").removeClass("is-valid");
    $("#productUnitInput").addClass("is-invalid");
    return false;
  }
  if (!validator.isNumeric(input, { no_symbols: true })) {
    $("#productUnitErrorMsg").text("Product unit must contain only number");
    $("#productUnitInput").removeClass("is-valid");
    $("#productUnitInput").addClass("is-invalid");
    return false;
  }

  if (!validator.isInt(input)) {
    $("#productUnitErrorMsg").text("Product unit must be an integer");
    $("#productUnitInput").removeClass("is-valid");
    $("#productUnitInput").addClass("is-invalid");
    return false;
  }
  $("#productUnitInput").removeClass("is-invalid");
  $("#productUnitInput").addClass("is-valid");
  return input;
}

function validateProductPriceInput() {
  const input = $("#productPriceInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#productPriceErrorMsg").text(
      "Product price can't be empty or contain special character"
    );
    $("#productPriceInput").removeClass("is-valid");
    $("#productPriceInput").addClass("is-invalid");
    return false;
  }
  if (!validator.isNumeric(input, { no_symbols: false })) {
    $("#productPriceErrorMsg").text("Product price must contain only number");
    $("#productPriceInput").removeClass("is-valid");
    $("#productPriceInput").addClass("is-invalid");
    return false;
  }
  $("#productPriceInput").removeClass("is-invalid");
  $("#productPriceInput").addClass("is-valid");
  return input;
}

function validateProductNameInput() {
  const input = $("#productNameInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#productNameErrorMsg").text("Product name can't be empty");
    $("#productNameInput").removeClass("is-valid");
    $("#productNameInput").addClass("is-invalid");
    return false;
  }
  const minChar = 3;
  const maxChar = 50;
  if (!validator.isByteLength(input, { min: minChar, max: maxChar })) {
    $("#productNameErrorMsg").text(
      `Product name length must be between ${minChar}-${maxChar} characters`
    );
    $("#productNameInput").removeClass("is-valid");
    $("#productNameInput").addClass("is-invalid");
    return false;
  }
  $("#productNameInput").removeClass("is-invalid");
  $("#productNameInput").addClass("is-valid");
  return input;
}

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

async function renderBrandsAndCategories() {
  const brands = await fetchSelectData("/api/v1/brand");
  const categories = await fetchSelectData("/api/v1/category");

  const brandOptions = [];
  const categoryOptions = [];
  brandOptions.push(`<option value="default" selected>Choose a brand</option>`);
  categoryOptions.push(
    `<option value="default" selected>Choose a category</option>`
  );

  brands.forEach((brand) => {
    brandOptions.push(`<option value="${brand.value}">${brand.text}</option>`);
  });

  categories.forEach((category) => {
    categoryOptions.push(
      `<option value="${category.value}">${category.text}</option>`
    );
  });

  $("#brandSelect").html(brandOptions.join("\n"));
  $("#categorySelect").html(categoryOptions.join("\n"));
}

async function fetchSelectData(url) {
  let res = await axios({
    method: "get",
    url: url,
  });
  return res.data.items.map((item) => {
    return {
      value: item.id,
      text: item.name,
    };
  });
}

async function deleteProduct(id){
  try {
    let res = await axios({
      method: "delete",
      url: `/api/v1/product/${id}`,
    });
    console.log(res);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}


function addProductImages(el) {
  const index = $(el).data("img-index");
  currentCarousel = index;
  $("#file-input").trigger("click");
}

function removeProductImages(el) {
  const index = $(el).data("img-index");
  currentCarousel = index - 1;
  if (currentCarousel <= 0) currentCarousel = 0;
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
  productsImages.splice(currentCarousel + 1, 0, file);
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
    $("#productImagesCarousel .carousel-indicators").html("");
    $("#productImagesCarousel .carousel-inner").html(
      `
        <div class="carousel-item active">
            <div class="image-item carousel-holder"></div>
            <div class="carousel-caption">
                <button type="button" data-img-index="0" class="add-image-btn btn btn-primary rounded-circle m-2"><i class="fa-solid fa-plus"></i></button>
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
                  <button type="button" data-img-index="${i}" class="rm-image-btn btn btn-danger rounded-circle m-2"><i class="fa-solid fa-trash-can"></i></button>
                  <button type="button" data-img-index="${i}" class="add-image-btn btn btn-primary rounded-circle m-2"><i class="fa-solid fa-plus"></i></button>
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
    url: `/api/v1/product?limit=${limit}&page=${page}`,
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
    <th scope="col">Product Name</th>
    <th scope="col">Image</th>
    <th scope="col">Price</th>
    <th scope="col">Status</th>
    <th scope="col">Brand Name</th>
    <th scope="col">Category Name </th>
    <th scope="col">Created At</th>
    <th scope="col">&nbsp;</th>
    </tr>
    `;
};

renderTableRow = (item) => {
  return `<tr>
  <td class="align-middle">${item.id}</td>
  <td class="align-middle">${item.name}</td>
  <td class="align-middle">${
    item.images.length > 0
      ? `<img src=${item.images[0]} style="max-width:100px;max-height:100px; object-fit: contain;">`
      : "Not avalable"
  }</td>
  <td class="align-middle">${item.price}</td>
  <td class="align-middle">${item.status}</td>
  <td class="align-middle">${item.brand? item.brand.name: 'not available'}</td>
  <td class="align-middle">${item.category? item.category.name: 'not available'}</td>
  <td class="align-middle">${item.createdAt}</td>
  <td class="align-middle">
  <div class="dropdown position-static">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Manage
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><button class="manage-btn-edit dropdown-item btn"  data-id='${
          item.id
        }' data-op='remove'>Edit</button></li>
        <li class="dropdown-divider"></li>
        <li><button class="manage-btn-delete dropdown-item text-danger btn" data-id='${
          item.id
        }'>Remove</button></li>
      </ul>
    </div>
</td>
</tr>
`;
};

bindRowAction = () => {
  $(".manage-btn-delete").click(function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    
    $("#documentDelete").data("id", id);

    // call func here
    $("#page-modal").modal("show");
  });
};

setTableName = () => {
  return "Products";
};
