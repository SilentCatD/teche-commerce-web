$(document).ready(function () {
  $("#categorySubmit").click(async function (e) {
    e.preventDefault();
    const input = validateCategoryNameInput();
    if (input === false) return;
    toggleBtnLoading(true);
    toggleFormInput(true);
    const result = await createCategory(input);
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
    validateCategoryNameInput();
  });



});

async function createCategory(categoryName) {
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

function validateCategoryNameInput() {
  const input = $("#inputCategoryName").val().trim();
  if (validator.isEmpty(input, { ignore_whitespace: true })) {
    $("#categoryErrorMsg").text("Category name can't be empty");
    $("#inputCategoryName").addClass("is-invalid");
    return false;
  }
  const minChar = 3;
  const maxChar = 50;
  if (!validator.isByteLength(input, { min: minChar, max: maxChar })) {
    $("#categoryErrorMsg").text(
      `Category name length must be between ${minChar}-${maxChar} characters`
    );
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




getItemsMethods =  async (limit, page)=>{
  return axios({
    method: "get",
    url: `/api/v1/category?limit=${limit}&page=${page}`,
  });
}


setLimit = ()=>{
  return 12;
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
  <td class="align-middle">${item._id}</td>
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
        <li><button class="manage-btn dropdown-item btn"  data-id='${item._id}' data-op='remove'>Edit</button></li>
        <li class="dropdown-divider"></li>
        <li><button class="manage-btn dropdown-item text-danger btn" data-id='${item._id}' data-op="edit">Remove</button></li>
      </ul>
    </div>
</td>
</tr>
`;
}


bindRowAction = ()=>{
  $('.manage-btn').click(function (e) { 
    e.preventDefault();
    const id = $(this).attr('data-id');
    const op = $(this).attr('data-op');
    // call func here
    $('#page-modal').modal('show'); 
  });
}