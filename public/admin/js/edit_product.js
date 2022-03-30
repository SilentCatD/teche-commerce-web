let productsImages = [];
let currentCarousel;

$(document).ready(function () {
  productsImages = product.images;
  currentCarousel = 0;
  renderProductsCarousel();
  bindCarousel();
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
    const result = await editProduct(
      name,
      description,
      price,
      unit,
      brand,
      category
    );
    toggleBtnLoading(false);
    toggleFormInput(false);
    if (result) {
      triggerReloadBtn();
      displayAlert(true, "Product Edited");
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
  $(".reload-trigger").click(async function (e) {
    e.preventDefault();

    $(this).prop("disabled", true);
    $(this).toggleClass("btn-primary btn-secondary");
    $(".reload-trigger i").toggleClass("fa-spin");
    await reloadFormData();
    $(this).prop("disabled", false);
    $(this).toggleClass("btn-primary btn-secondary");
    $(".reload-trigger i").toggleClass("fa-spin");
  });
});

function triggerReloadBtn() {
  $(".reload-trigger").trigger("click");
}

async function urlToFile(url) {
  const res = await fetch(url, {mode: 'cors'});
  const blob = await res.blob();
  const file = new File([blob], "file-name", { type: "image/jpeg" });
  return file;
}

async function editProduct(name, description, price, unit, brand, category) {
  try {
    let formData = new FormData();
    formData.append("productName", name);
    formData.append("productDetails", description);
    formData.append("productPrice", price);
    formData.append("productUnit", unit);
    formData.append("productBrand", brand);
    formData.append("productCategory", category);
    for (let i = 0; i < productsImages.length; i++) {
      if(productsImages[i] instanceof File){ 

      }else{
        productsImages[i] = await urlToFile(productsImages[i]);
      }
      formData.append("images", productsImages[i]);
    }
    const res = await axios({
      method: "put",
      url: `/api/v1/product/${product.id}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res.data);
    return true;
  } catch (e) {
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

async function reloadFormData() {
  toggleFormInput(true);
  currentCarousel = 0;
  await fetchAndRenderProduct();
  toggleFormInput(false);
}

async function fetchAndRenderProduct() {
  product = await fetchProductData(product);
  const brands = await fetchData("/api/v1/brand");
  const categories = await fetchData("/api/v1/category");
  renderProduct(product, brands, categories);
  renderProductsCarousel();
}
function toggleBtnLoading(loading) {
  if (loading) {
    $("#productSubmit").prop("disabled", true);
    $("#productSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Saving...");
    $("#loading-spinner").toggleClass("d-none");
  } else {
    $("#productSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Save");
    $("#loading-spinner").toggleClass("d-none");
    $("#productSubmit").prop("disabled", false);
  }
}
function validateProductDescription() {
  const input = $("#productDescription").val();
  return input;
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
      let src;
      if (productsImages[i] instanceof File) {
        src = URL.createObjectURL(productsImages[i]);
      } else {
        src = productsImages[i];
      }
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

function renderProduct(product, brands, categories) {
  $("#productNameInput").val(product.name);
  $("#formFile").val("");
  $("#productDescription").val(product.details);
  $("#productPriceInput").val(product.price);
  $("#productUnitInput").val(product.unit);
  productsImages = product.images;

  const brandsEls = [];
  const categoriesEls = [];

  brands.forEach((brand) => {
    brandsEls.push(`
        <option value="${brand.id}">${brand.name}</option>
        `);
  });

  if (!product.brand) {
    brandsEls.push(`
        <option value="default">Not selected</option>
        `);
  }

  categories.forEach((category) => {
    categoriesEls.push(`
        <option value="${category.id}">${category.name}</option>
        `);
  });

  if (!product.category) {
    categoriesEls.push(`
        <option value="default">Not selected</option>
        `);
  }

  $("#brandSelect").html(brandsEls.join("\n"));
  $("#categorySelect").html(categoriesEls.join("\n"));
  $("#brandSelect").val(product.brand ? product.brand.id : "default");
  $("#categorySelect").val(product.category ? product.category.id : "default");

  $("#productNameInput").removeClass("is-valid");
  $("#productPriceInput").removeClass("is-valid");
  $("#productUnitInput").removeClass("is-valid");
  $("#brandSelect").removeClass("is-valid");
  $("#categorySelect").removeClass("is-valid");
  $("#productNameInput").removeClass("is-invalid");
  $("#productPriceInput").removeClass("is-invalid");
  $("#productUnitInput").removeClass("is-invalid");
  $("#brandSelect").removeClass("is-invalid");
  $("#categorySelect").removeClass("is-invalid");
}

async function fetchData(url) {
  const res = await axios({
    method: "get",
    url: url,
  });
  return res.data.items;
}

async function fetchProductData(product) {
  const res = await axios({
    method: "get",
    url: `/api/v1/product/${product.id}`,
  });

  return res.data;
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
