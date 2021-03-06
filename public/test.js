async function addBrand(name, img) {
  let formData = new FormData();
  console.log(img);
  img.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("brandName", name);
  try {
    let res = await axios({
      method: "post",
      url: "/api/v1/brand",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    $("#db-res").text(res.data);
  } catch (e) {
    $("#db-res").text(e);
  }
  $("#add-brand-name").val("");
  $("#add-brand-img").val("");
}

$("#add-brand-btn").click(function (e) {
  e.preventDefault();

  const brandNameVal = $("#add-brand-name").val();
  const imgFile = $("#add-brand-img").prop("files")[0];

  if (!brandNameVal) {
    $("#add-brand-name-error").text("Must provide a valid brand name");
    return;
  }
  $("#add-brand-name-error").text("");
  if (imgFile) {
    const imgFileType = imgFile.type;
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(imgFileType)) {
      $("#add-brand-img-error").text("That's not an image");
      return;
    }
    $("#add-brand-img-error").text("");
  }
  addBrand(brandNameVal, [imgFile]);
});

async function editBrand(id, name, img) {
  let formData = new FormData();
  console.log(img);
  formData.append("brandName", name);
  formData.append("brandImg", img);
  try {
    let res = await axios({
      method: "post",
      url: `/api/v1/brand/${id}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    $("#db-res").text(res.data);
  } catch (e) {
    $("#db-res").text(e);
  }
  $("#add-brand-name").val("");
  $("#add-brand-img").val("");
}

$("#edit-brand-btn").click(function (e) {
  e.preventDefault();

  const brandId = $("#edit-brand-id").val();
  const brandNameVal = $("#edit-brand-name").val();
  const imgFile = $("#edit-brand-img").prop("files")[0];

  if (!brandId) {
    $("#edit-brand-name-error").text("Must provide a valid brand ID");
    return;
  }
  if (!brandNameVal) {
    $("#edit-brand-name-error").text("Must provide a valid brand name");
    return;
  }
  $("#edit-brand-name-error").text("");
  if (imgFile) {
    const imgFileType = imgFile.type;
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(imgFileType)) {
      $("#edit-brand-img-error").text("That's not an image");
      return;
    }
    $("#edit-brand-img-error").text("");
  }
  editBrand(brandId, brandNameVal, imgFile);
});

async function deleteBrandById(id) {
  try {
    let response = await axios({
      method: "delete",
      url: `/api/v1/brand/${id}`,
    });
    console.log(response);
    $("#db-res").text(response.data);
  } catch (e) {
    $("#db-res").text("Failed to delete brand");
  }
  $("#brand-id-input").val("");
}

$("#delete-brand-btn").click(function (e) {
  e.preventDefault();
  const brandIdVal = $("#brand-id-input").val();
  if (!brandIdVal) {
    $("#brand-id-input-error").text("brand id cant be empty");
    return;
  }
  $("#brand-id-input-error").text("");
  deleteBrandById(brandIdVal);
});

async function addCategory(categoryName) {
  let data = {};
  data.categoryName = categoryName;
  try {
    let res = await axios({
      method: "post",
      url: "/api/v1/category",
      data: data,
    });
    $("#db-res").text(res.data);
  } catch (e) {
    $("#db-res").text(e);
  }
  $("#add-cate-name").val("");
}

$("#add-cate-btn").click(function (e) {
  e.preventDefault();

  const categoryNameVal = $("#add-cate-name").val();

  if (!categoryNameVal) {
    $("#add-cate-name-error").text("Must provide a valid category name");
    console.log(categoryNameVal);
    return;
  }
  $("#add-cate-name-error").text("");
  addCategory(categoryNameVal);
});

async function editCategory(id, categoryName) {
  let data = {};
  data.categoryName = categoryName;
  try {
    let res = await axios({
      method: "post",
      url: `/api/v1/category/${id}`,
      data: data,
    });
    $("#db-res").text(res.data);
  } catch (e) {
    $("#db-res").text(e);
  }
  $("#edit-cate-name").val("");
}

$("#edit-cate-btn").click(function (e) {
  e.preventDefault();

  console.log("fuck");
  const categoryIdVal = $("#edit-cate-id").val();

  const categoryNameVal = $("#edit-cate-name").val();

  if (!categoryIdVal) {
    $("#edit-cate-name-error").text("Must provide a valid category ID");
    return;
  }
  if (!categoryNameVal) {
    $("#edit-cate-name-error").text("Must provide a valid category name");
    return;
  }
  $("#edit-cate-name-error").text("");
  editCategory(categoryIdVal, categoryNameVal);
});

async function deleteCategoryById(id) {
  try {
    let response = await axios({
      method: "delete",
      url: `/api/v1/category/${id}`,
    });
    console.log(response);
    $("#db-res").text(response.data);
  } catch (e) {
    $("#db-res").text("Failed to delete category");
  }
  $("#cate-id-input").val("");
}

$("#delete-cate-btn").click(function (e) {
  e.preventDefault();
  const categoryIdVal = $("#cate-id-input").val();
  if (!categoryIdVal) {
    $("#cate-id-input-error").text("category id cant be empty");
    return;
  }
  $("#cate-id-input-error").text("");
  deleteCategoryById(categoryIdVal);
});

// ======================================

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

async function CreateProduct(
  productName,
  productDetails,
  productBrand,
  productCategory,
  productPrice
) {
  let formData = new FormData();
  formData.append("productName", productName);
  formData.append("productDetails", productDetails);
  formData.append("productBrand", productBrand);
  formData.append("productCategory", productCategory);
  formData.append("productPrice", productPrice);
  imgFileToUpload.forEach((file) => {
    formData.append("images", file);
  });
  try {
    let response = await axios({
      method: "post",
      url: "/api/v1/product",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    $("#db-res").text(response.data);
  } catch (e) {
    $("#db-res").text("Failed to create product");
  }
}

$("#add-product-btn").click(async function (e) {
  e.preventDefault();
  const productName = $("#product-name").val().trim();
  const productDetails = $("#product-detail").val().trim();
  const productBrand = $("#product-brand").val().trim();
  const productCategory = $("#product-category").val().trim();
  const productPrice = $("#product-price").val().trim();
  if (!productPrice || !isNumeric(productPrice)) {
    $("#product-price-input-error").text("Invalid product price");
    return;
  }

  if (!productName) {
    $("#product-name-input-error").text("Invalid product name");
    return;
  }
  if (!productBrand) {
    $("#product-name-input-error").text("Invalid product Brand");
    return;
  }
  if (!productCategory) {
    $("#product-name-input-error").text("Invalid product Category");
    return;
  }

  await CreateProduct(
    productName,
    productDetails,
    productBrand,
    productCategory,
    productPrice
  );

  resetProductInput();
});

async function deleteProductById(id) {
  try {
    let response = await axios({
      method: "delete",
      url: `/api/v1/product/${id}`,
    });
    console.log(response);
    $("#db-res").text(response.data);
  } catch (e) {
    $("#db-res").text("Failed to delete product");
  }
  $("#product-id-input").val("");
}

$("#delete-product-btn").click(function (e) {
  e.preventDefault();
  const productIdVal = $("#product-id-input").val();
  if (!productIdVal) {
    $("#product-id-input-error").text("category id cant be empty");
    return;
  }
  $("#product-id-input-error").text("");
  deleteProductById(productIdVal);
});

async function EditProduct(
    id,
    productName,
    productDetails,
    productBrand,
    productCategory,
    productPrice
  ) {
    let formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDetails", productDetails);
    formData.append("productBrand", productBrand);
    formData.append("productCategory", productCategory);
    formData.append("productPrice", productPrice);
    imgFileToUpload.forEach((file) => {
      formData.append("images", file);
    });
    try {
      let response = await axios({
        method: "post",
        url: `/api/v1/product/${id}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      $("#db-res").text(response.data);
    } catch (e) {
      $("#db-res").text("Failed to create product");
    }
  }

$("#edit-product-btn").click(async function (e) {
  e.preventDefault();

  $("#edit-product-id-input-error").text("");


  const productId = $("#edit-product-id").val().trim();
  const productName = $("#edit-product-name").val().trim();
  const productDetails = $("#edit-product-detail").val().trim();
  const productBrand = $("#edit-product-brand").val().trim();
  const productCategory = $("#edit-product-category").val().trim();
  const productPrice = $("#edit-product-price").val().trim();


  console.log(productName);
  if (!productId) {
    $("#edit-product-id-input-error").text("Invalid product ID");
    return;
  }

   await EditProduct(
    productId,
    productName,
    productDetails,
    productBrand,
    productCategory,
    productPrice
  );

  $("#edit-product-name").text("");
  $("#edit-product-detail").text("");
  $("#edit-product-brand").text("");
  $("#edit-product-category").text("");
  $("#edit-product-price").text("");
  imgFileToUpload = [];
  $("#img-holder-list").html("");
});

let imgFileToUpload = []; // File
$("#add-product-img-btn").click(function (e) {
  e.preventDefault();
  const file = $("#product-img").prop("files")[0];
  if (!file) {
    $("#product-img-input-error").text("must input an image");
    return;
  }
  $("#product-img-input-error").text("");
  imgFileToUpload.push(file);
  $("#img-holder-list").append(
    `<li><img src=${URL.createObjectURL(file)} width="200px"></li>`
  );
  $("#product-img").val("");
});

function resetProductInput() {
  $("#product-price-input-error").text("");
  $("#product-name").text("");
  $("#product-detail").text("");
  $("#product-brand").text("");
  $("#product-category").text("");
  $("#product-price").text("");
  imgFileToUpload = [];
  $("#img-holder-list").text("");

}
