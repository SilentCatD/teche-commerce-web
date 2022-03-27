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





getItemsMethods =  async (limit, page)=>{
  return axios({
    method: "get",
    url: `/api/v1/brand?limit=${limit}&page=${page}`,
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
  <th scope="col">Brand Name</th>
  <th scope="col">Brand Image</th>
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
  <td class="align-middle">${item.images.length > 0 ? `<img src=${item.images[0].firebaseUrl} style="max-width:100px;max-height:100px; object-fit: contain;">` : 'Not avalable'}</td>
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

setTableName = ()=>{
  return "Brands"
}