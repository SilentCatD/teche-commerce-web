let images = [];

$(document).ready(function () {
  $("#brandSubmit").click(async function (e) {
    e.preventDefault();
    const input = validateBrandNameInput();
    const file = validateBrandImg();
    if (input === false || file === false) return;
    toggleBtnLoading(true);
    toggleFormInput(true);
    const result = await createBrand(input, file);
    toggleBtnLoading(false);
    toggleFormInput(false);
    if (result) {
      displayAlert(true, "Brand added");
      clearAllInput();
    } else {
      displayAlert(false, "Something went wrong");
    }
  });

  $("#inputBrandName").on("input propertychange", function (e) {
    e.preventDefault();
    validateBrandNameInput();
  });

  $("#formFile").change(function (e) {
    e.preventDefault();
    validateBrandImg();
  });
});

async function createBrand(brandName, imgFile) {
  try {
    let formData = new FormData();
    if(imgFile){
        formData.append("images", imgFile);
    }
    formData.append("brandName", brandName);
    let res = await axios({
        method: "post",
        url: "/api/v1/brand",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    console.log(res);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function toggleFormInput(valid) {
  if (valid) {
    $("#inputBrandName").prop("disabled", true);
    $("#formFile").prop("disabled", true);
  } else {
    $("#inputBrandName").prop("disabled", false);
    $("#formFile").prop("disabled", false);
  }
}

function toggleBtnLoading(loading) {
  if (loading) {
    $("#brandSubmit").prop("disabled", true);
    $("#brandSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Adding...");
    $("#loading-spinner").toggleClass("d-none");
  } else {
    $("#brandSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Add");
    $("#loading-spinner").toggleClass("d-none");
    $("#brandSubmit").prop("disabled", false);
  }
}

function validateBrandNameInput() {
  const input = $("#inputBrandName").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#brandErrorMsg").text("Brand name can't be empty");
    $("#inputBrandName").addClass("is-invalid");
    return false;
  }
  const minChar = 3;
  const maxChar = 50;
  if (!validator.isByteLength(input, { min: minChar, max: maxChar })) {
    $("#brandErrorMsg").text(
      `Brand name length must be between ${minChar}-${maxChar} characters`
    );
    $("#inputBrandName").addClass("is-invalid");
    return false;
  }
  $("#inputBrandName").removeClass("is-invalid");
  $("#inputBrandName").addClass("is-valid");
  return input;
}

function validateBrandImg() {
  const file = $("#formFile").prop("files")[0];
  if (!file) return;
  const mineType = file.type;
  const accept_types = ['image/jpeg', 'image/png'];
  if (!accept_types.includes(mineType)) {
    $("#brandImgErrorMsg").text(`File type must be either .jpeg or .png`);
    $("#formFile").addClass("is-invalid");
    displayImage(false);
    return false;
  }
  $("#formFile").removeClass("is-invalid");
  $("#formFile").addClass("is-valid");
  displayImage(file);
  return file;
}

function clearAllInput() {
  $("#inputBrandName").val("");
  $("#formFile").val("");
  $("#inputBrandName").removeClass("is-valid");
  $("#formFile").removeClass("is-valid");
  displayImage(false);
}

function displayImage(file){
    if(file ===false){
        $('#img-holder img').attr('src', '');
        $('#img-holder').addClass('d-none');
    }else{
        const src = URL.createObjectURL(file);
        $('#img-holder img').attr('src', src);
        $('#img-holder').removeClass('d-none');
    }
}
