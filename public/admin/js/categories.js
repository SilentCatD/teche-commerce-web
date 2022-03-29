$(document).ready(function () {
  $("#categoryDelete").click(async function () {
    const id = $(this).data('id');
    $("#categoryDelete").removeData("id");
    if(await deleteCategory(id)) {
      displayAlert(true, "Category Deleted");
    } else {
      displayAlert(false, "Something fuckup");
    }
    $("#page-modal").modal("hide");
    $(".table-load-trigger").click();
  });
  $("#categorySubmit").click(async function (e) {
    e.preventDefault();
    const input = validateBrandNameInput();
    if (input === false) return;
    toggleBtnLoading(true);
    toggleFormInput(true);
    const result = await createBrand(input);
    toggleBtnLoading(false);
    toggleFormInput(false);
    if (result) {
      displayAlert(true, "Category added");
      clearAllInput();
    } else {
      displayAlert(false, "Something went wrong");
    }
  });

  $("#inputCategoryName").on("input propertychange", function (e) {
    e.preventDefault();
    validateBrandNameInput();
  });



});

async function createBrand(categoryName) {
  try {
    let data = {};
    data.categoryName = categoryName;
    let res = await axios({
      method: "post",
      url: "/api/v1/category",
      data: data,
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
    $("#inputCategoryName").prop("disabled", true);
  } else {
    $("#inputCategoryName").prop("disabled", false);
  }
}

function toggleBtnLoading(loading) {
  if (loading) {
    $("#categorySubmit").prop("disabled", true);
    $("#categorySubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Adding...");
    $("#loading-spinner").toggleClass("d-none");
  } else {
    $("#categorySubmit").toggleClass("btn-primary btn-secondary");
    $("#btn-text").text("Add");
    $("#loading-spinner").toggleClass("d-none");
    $("#categorySubmit").prop("disabled", false);
  }
}

function validateBrandNameInput() {
  const input = $("#inputCategoryName").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#categoryErrorMsg").text("Category name can't be empty");
    $("#inputCategoryName").removeClass("is-valid");
    $("#inputCategoryName").addClass("is-invalid");
    return false;
  }
  const minChar = 3;
  const maxChar = 50;
  if (!validator.isByteLength(input, { min: minChar, max: maxChar })) {
    $("#categoryErrorMsg").text(
      `Category name length must be between ${minChar}-${maxChar} characters`
    );
    $("#inputCategoryName").removeClass("is-valid");
    $("#inputCategoryName").addClass("is-invalid");
    return false;
  }
  $("#inputCategoryName").removeClass("is-invalid");
  $("#inputCategoryName").addClass("is-valid");
  return input;
}

function clearAllInput() {
  $("#inputCategoryName").val("");
  $("#inputCategoryName").removeClass("is-valid");
}


async function deleteCategory(categoryId) {
  try {
    let res = await axios({
      method: "delete",
      url: `/api/v1/category/${categoryId}`,
    });
    console.log(res);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

getItemsMethods =  async (limit, page)=>{
  return axios({
    method: "get",
    url: `/api/v1/category?limit=${limit}&page=${page}`,
  });
}


setLimit = ()=>{
  return 10;
}

  
setDisplayPage = ()=>{
  return 5;
}


initialPage = ()=>{return 1};

renderTableHead = () =>{
  return `<tr>
  <th scope="col">ID</th>
  <th scope="col">Categories Name</th>
  <th scope="col">Number of products</th>
  <th scope="col">Ranking Points</th>
  <th scope="col">Created At</th>
  <th scope="col">&nbsp;</th>
  </tr>
  `;
}


renderTableRow = (item)=>{
  return `<tr>
  <td class="align-middle">${item.id}</td>
  <td class="align-middle">${item.name}</td>
  <td class="align-middle">${item.productsHold}</td>
  <td class="align-middle">${item.rankingPoints}</td>
  <td class="align-middle">${item.createdAt}</td>
  <td class="align-middle">
  <div class="dropdown position-static">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Manage
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><button class="manage-btn-edit dropdown-item btn"  data-id='${item.id}' data-op='remove'>Edit</button></li>
        <li class="dropdown-divider"></li>
        <li><button class="manage-btn-delete dropdown-item text-danger btn" data-id='${item.id}' data-op="edit">Remove</button></li>
      </ul>
    </div>
</td>
</tr>
`;
}


bindRowAction = ()=>{
  $('.manage-btn-delete').click(function (e) { 
    e.preventDefault();
    const id = $(this).attr('data-id');
    // call func here

    console.log(id);
    $("#categoryDelete").data("id", id);

    $('#page-modal').modal('show'); 

  });
}

setTableName = ()=>{
  return "Categories";
}