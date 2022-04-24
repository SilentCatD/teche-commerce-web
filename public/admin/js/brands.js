import APIService from "../../utils/api_service.js";
import { goBackToLoginIfNotAdmin, sleep } from "../../utils/common.js";
import {pageConfig} from '../js/data_table.js';
import displayAlert from '../js/alert.js';
import {modalConfig, documentOperation} from '../js/modal.js';

modalConfig.modalBody = "Do you wish to delete this brand?";
modalConfig.modalHeader  = "Remove Brand";
modalConfig.modalOpName = "Remove";
modalConfig.operation = async(id)=>{
  await APIService.deleteBrand(id);
}

$(document).ready(async function () {
  await goBackToLoginIfNotAdmin();
  await sleep(50);
  $("#spinner").removeClass("show");

  documentOperation("brand deleted", "something went wrong");
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
      triggerReloadBtn();
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
    await APIService.createBrand({ brandName, imgFile });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteBrand(brandId) {
  try {
    await APIService.deleteBrand(brandId);
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
    $("#inputBrandName").removeClass("is-valid");
    $("#inputBrandName").addClass("is-invalid");
    return false;
  }
  const minChar = 3;
  const maxChar = 50;
  if (!validator.isByteLength(input, { min: minChar, max: maxChar })) {
    $("#brandErrorMsg").text(
      `Brand name length must be between ${minChar}-${maxChar} characters`
    );
    $("#inputBrandName").removeClass("is-valid");
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
  const accept_types = ["image/jpeg", "image/png"];
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

function triggerReloadBtn() {
  $(".table-load-trigger").trigger("click");
}

function displayImage(file) {
  if (file === false) {
    $("#img-holder img").attr("src", "");
    $("#img-holder").addClass("d-none");
  } else {
    const src = URL.createObjectURL(file);
    $("#img-holder img").attr("src", src);
    $("#img-holder").removeClass("d-none");
  }
}

pageConfig.getItemsMethods = async () => {
  return await APIService.fetchAllBrand({page: pageConfig.page, limit: pageConfig.limit});
};

pageConfig.limit = 5;

pageConfig.displayPage = 5;


pageConfig.tableHead =
  `<tr>
  <th scope="col">ID</th>
  <th scope="col">Brand Name</th>
  <th scope="col">Brand Image</th>
  <th scope="col">Number of products</th>
  <th scope="col">Ranking Points</th>
  <th scope="col">Created At</th>
  <th scope="col">&nbsp;</th>
  </tr>
  `;


pageConfig.renderTableRow = (item) => {
  return `<tr>
  <td class="align-middle">${item.id}</td>
  <td class="align-middle">${item.name}</td>
  <td class="align-middle">${
    item.image
      ? `<img src=${item.image} style="max-width:100px;max-height:100px; object-fit: contain;">`
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
        <li><button class="manage-btn manage-btn-edit dropdown-item btn"  data-id='${
          item.id
        }'>Edit</button></li>
        <li class="dropdown-divider"></li>
        <li><button class="manage-btn manage-btn-delete dropdown-item text-danger btn" data-id='${
          item.id
        }'>Remove</button></li>
      </ul>
    </div>
</td>
</tr>
`;
};

pageConfig.bindRowAction = () => {
  $(".manage-btn-delete").click(function (e) {
    e.preventDefault();
    const id = $(this).data("id");

    $("#documentOperation").data("id", id);

    // call func here
    $("#page-modal").modal("show");
  });
};


pageConfig.tableName= "Brands";

