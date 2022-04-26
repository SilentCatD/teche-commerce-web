import APIService from "../../utils/api_service.js";
import { goBackToLoginIfNotAdmin, sleep } from "../../utils/common.js";
import {pageConfig} from "../js/data_table.js";
import displayAlert from "../js/alert.js";
import {modalConfig, documentOperation} from '../js/modal.js';

modalConfig.modalBody = "Do you wish to toggle Active/Unactive this account?";
modalConfig.modalHeader  = "Toggle Active";
modalConfig.modalOpName = "Toggle Active/Unactive";
modalConfig.operation = async(id)=>{
  await APIService.toggleActiveAccount(id);
}

pageConfig.query = "";
pageConfig.role = "user";
pageConfig.sort = 'createdAt';
pageConfig.order_by = 'desc';

pageConfig.limit = 5;
pageConfig.displayPage = 5;
pageConfig.getItemsMethods = async()=>{
  return await APIService.fetchAllAccounts({page: pageConfig.page, limit: pageConfig.limit, query: pageConfig.query, role: pageConfig.role, sort: pageConfig.sort, order_by: pageConfig.order_by});
}

pageConfig.tableName = "Accounts";

pageConfig.tableHead = `<tr>
    <th scope="col">ID</th>
    <th scope="col">Name</th>
    <th scope="col">Email</th>
    <th scope="col">Role</th>
    <th scope="col">Status</th>
    <th scope="col">Created At</th>
    <th scope="col">&nbsp;</th>
    </tr>
    `;

pageConfig.renderTableRow = (item) => {
  const active = item.status == 'active';
  return `<tr>
  <td class="align-middle">${item.id}</td>
  <td class="align-middle">${item.name}</td>
  <td class="align-middle">${item.email}</td>
  <td class="align-middle">${item.role}</td>
  <td class="align-middle ${active? 'text-success' : 'text-danger'}">${item.status}</td>
  <td class="align-middle">${item.createdAt}</td>

  <td class="align-middle">
  <div class="dropdown position-static">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Manage
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a href="/admin/accounts/${item.id}" class="acc-detail dropdown-item btn" data-id='${
          item.id
        }'>Details</a></li>
        <li class="dropdown-divider"></li>
        <li><a class="manage-btn-delete dropdown-item btn text-danger"  data-id='${
    item.id
  }'>${!active ? 'Active' : 'Unactive'}</a></li>
      </ul>
    </div>
</td>
</tr>
`;
};
pageConfig.bindRowAction = () => {
  $(".acc-status-toggle").click(function (e) {
    e.preventDefault();
    const id = $(this).data("id");

    $("#documentDelete").data("id", id);

    // call func here
    $("#page-modal").modal("show");
  });
};

$(document).ready(async function () {
  await goBackToLoginIfNotAdmin();
  await sleep(50);
  $("#spinner").removeClass("show");

  $('#sortOption').change(function (e) { 
    e.preventDefault();
    const val = $(this).val().trim();
    pageConfig.sort = val;
    triggerReloadBtn();
  });

  $('#sortOrder').change(function (e) { 
    e.preventDefault();
    const val = $(this).val().trim();
    pageConfig.order_by = val;
    triggerReloadBtn();
  });

  $('#searchForm').submit(function (e) { 
    e.preventDefault();
    const query = $('#tableSearch').val().trim();
    pageConfig.query = query;
    pageConfig.page = 1;
    triggerReloadBtn();
  });

  $("input[name='accSwitch']").click(function() {
    var role = $(this).filter(':checked').val();
    pageConfig.role = role;
    pageConfig.page = 1;
    triggerReloadBtn();
  });

  $("#emailInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateEmail();
  });

  $("#passwordInput").on("input propertychange", function (e) {
    e.preventDefault();
    validatePassword();
  });

  $("#nameInput").on("input propertychange", function (e) {
    e.preventDefault();
    validateName();
  });

  $("#accountSubmit").click(async function (e) {
    e.preventDefault();
    // const input = validateBrandNameInput();
    const email = validateEmail();
    const pwd = validatePassword();
    const name = validateName();
    if (!(email && pwd && name)) {
      return;
    }
    toggleBtnLoading(true);
    toggleFormInput(true);
    let result;
    try {
      $("#serverError").text("");
      await APIService.createAdminAccount(email, name, pwd);
      result = true;
    } catch (e) {
      $("#serverError").text(e.message);
      result = false;
    }
    toggleBtnLoading(false);
    toggleFormInput(false);
    if (result) {
      displayAlert(true, "Account added");
      clearAllInput();
    } else {
      displayAlert(false, "Something went wrong");
    }
  });
  documentOperation("Account avaibility toggled", "Something went wrong");
});

function toggleFormInput(valid) {
  if (valid) {
    $("#emailInput").prop("disabled", true);
    $("#passwordInput").prop("disabled", true);
    $("#nameInput").prop("disabled", true);
  } else {
    $("#emailInput").prop("disabled", false);
    $("#passwordInput").prop("disabled", false);
    $("#nameInput").prop("disabled", false);
  }
}

function clearAllInput() {
  $("#nameInput").val("");
  $("#nameInput").removeClass("is-valid");
  $("#passwordInput").val("");
  $("#passwordInput").removeClass("is-valid");
  $("#emailInput").val("");
  $("#emailInput").removeClass("is-valid");
}

function toggleBtnLoading(loading) {
  if (loading) {
    $("#accountSubmit").prop("disabled", true);
    $("#accountSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Adding...");
    $("#loading-spinner").toggleClass("d-none");
  } else {
    $("#accountSubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Add");
    $("#loading-spinner").toggleClass("d-none");
    $("#accountSubmit").prop("disabled", false);
  }
}

function validateEmail() {
  const input = $("#emailInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#emailErrorMsg").text("Email can't be empty");
    $("#emailInput").addClass("is-invalid");
    return false;
  }

  if (!validator.isEmail(input)) {
    $("#emailErrorMsg").text("Invalid email format");
    $("#emailInput").addClass("is-invalid");
    return false;
  }

  $("#emailInput").removeClass("is-invalid");
  return input;
}

function validatePassword() {
  const input = $("#passwordInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#passwordErrorMsg").text("Password can't be empty");
    $("#passwordInput").addClass("is-invalid");
    return false;
  }

  if (!validator.isStrongPassword(input, { minSymbols: 0 })) {
    $("#passwordErrorMsg").text("Password not Strong enough");
    $("#passwordInput").addClass("is-invalid");
    return false;
  }

  $("#passwordInput").removeClass("is-invalid");
  return input;
}

function validateName() {
  const input = $("#nameInput").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#nameErrorMsg").text("Name can't be empty");
    $("#nameInput").addClass("is-invalid");
    return false;
  }

  if (!validator.isByteLength(input, { min: 3, max: 20 })) {
    $("#nameErrorMsg").text("Name must be between 3-20 character");
    $("#nameInput").addClass("is-invalid");
    return false;
  }

  $("#nameInput").removeClass("is-invalid");
  return input;
}

function triggerReloadBtn() {
  $(".table-load-trigger").trigger("click");
}

pageConfig.bindRowAction = () => {
  $(".manage-btn-delete").click(function (e) {
    e.preventDefault();
    const id = $(this).data("id");

    $("#documentOperation").data("id", id);

    // call func here
    $("#page-modal").modal("show");
  });
};