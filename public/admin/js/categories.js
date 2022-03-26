const limit=15;
let page=1;
let totalPage;
const displayPage = 5;
let items = [];

$(document).ready(async function () {
  await initialLoading();
  $("#success-alert").hide();
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

  $(".table-load-trigger").click(async function (e) {
    e.preventDefault();

    $(this).prop("disabled", true);
    $(this).toggleClass("btn-primary btn-secondary");
    await tableLoadData();
    $(this).prop("disabled", false);
    $(this).toggleClass("btn-primary btn-secondary");
  });
});

async function switchPage(nextPage){
    nextPage=nextPage.trim();
    if(nextPage=="Next"){
        page++;
    }
    else if(nextPage=="Previous"){
        page--;
    }else{
        page = parseInt(nextPage);
    }
    await tableLoadData();
}

async function initialLoading() {
  $(".table-load-trigger").prop("disabled", true);
  $(".table-load-trigger").toggleClass("btn-primary btn-secondary");
  await tableLoadData();
  $(".table-load-trigger").prop("disabled", false);
  $(".table-load-trigger").toggleClass("btn-primary btn-secondary");
}

async function tableLoadData() {
  $(".table-data").addClass("table-loading");
  $(".table-data").removeClass("table-loaded");
  let res = await axios({
    method: "get",
    url: `/api/v1/category?limit=${limit}&page=${page}`,
  });
  items=[];
  totalPage = res.data['total-pages'];
  for(let i = 0; i < res.data['item-count']; i++){
    items.push(res.data.items[i]);
  }
  page= res.data['current-page'];
  renderTable();
  renderPagination();
  $(".table-data").removeClass("table-loading");
  $(".table-data").addClass("table-loaded");
}

function renderPagination(){
    const pages = [];
    if(page!=1){
        pages.push(
            `<li class="page-item"><a class="page-link">Previous</a></li>`
        );
    }
    let generated = 0;
    let curr=page-2;
    while(generated < displayPage){
        if(curr > totalPage){
            break;
        }
        if(curr> 0){
            if(curr==page){
                pages.push(`<li class="page-item active"><a class="page-link">${curr}</a></li>`);
            }else{
                pages.push(`<li class="page-item"><a class="page-link">${curr}</a></li>`)
            }
            generated++;
        }
        curr++;
    }
    
    if(page!=totalPage){
        pages.push(
            `<li class="page-item"><a class="page-link">Next</a></li>`
        );
    }
    $('.pagination').html(pages.join('\n'));
    $('.page-item').click(function (e) { 
        e.preventDefault();
        const nextPage = $(this).text().trim();
        switchPage(nextPage);
    });
    
}





function renderTable(){
    $('.table-fields tbody').html('');
    for (let row = 0; row < items.length; row++){
        $('.table-fields tbody:last-child').append(
            `<tr>
                <td class="align-middle">${items[row].name}</td>
                <td class="align-middle">${items[row].productsHold}</td>
                <td class="align-middle">${items[row].rankingPoints}</td>
                <td class="align-middle">${items[row].createdAt}</td>
            </tr>
            `
        );
    }
}



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

function displayAlert(result, text) {
  if (result) {
    $("#success-alert").addClass("alert-success");
    $("#success-alert > strong").text("Success!");
    $("#success-alert > span").text(text);
  } else {
    $("#success-alert").addClass("alert-danger");
    $("#success-alert > strong").text("Failed!");
    $("#success-alert > span").text(text);
  }

  $("#success-alert")
    .show(300)
    .fadeTo(1000, 300)
    .slideUp(300, function () {
      $("#success-alert").slideUp(300);
      $("#success-alert").removeClass("alert-danger");
      $("#success-alert").removeClass("alert-success");
    });
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
