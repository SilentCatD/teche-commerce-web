let limit;
let page;
let totalPage;
let displayPage;
let items = [];

function renderTable() {
  $(".table-fields tbody").html("");
  for (let row = 0; row < items.length; row++) {
    const item = items[row];
    $(".table-fields tbody:last-child").append(renderTableRow(item));
  }
  bindRowAction();
}

function renderPagination() {
  const pages = [];
  if (page != 1) {
    pages.push(`<li class="page-item"><a class="page-link">Previous</a></li>`);
  }
  let generated = 0;
  let startAt = page - Math.floor(displayPage/2);
  let curr = startAt;
  while (generated < displayPage) {
    if (curr > totalPage) {
      startAt--;
      if(startAt<1) break;
      pages.splice(1, 0,
        `<li class="page-item"><a class="page-link">${startAt}</a></li>`
      );
      generated++;
      continue;
    }
    if (curr > 0) {
      if (curr == page) {
        pages.push(
          `<li class="page-item active"><a class="page-link">${curr}</a></li>`
        );
      } else {
        pages.push(
          `<li class="page-item"><a class="page-link">${curr}</a></li>`
        );
      }
      generated++;
    }
    curr++;
  }

  if (page != totalPage) {
    pages.push(`<li class="page-item"><a class="page-link">Next</a></li>`);
  }
  $(".pagination").html(pages.join("\n"));
  $(".page-item").click(function (e) {
    e.preventDefault();
    const nextPage = $(this).text().trim();
    switchPage(nextPage);
  });
}

async function tableLoadData() {
  $(".table-data").addClass("table-loading");
  $(".table-data").removeClass("table-loaded");
  let res = await getItemsMethods(limit, page);
  items = [];
  totalPage = res["total-pages"];
  for (let i = 0; i < res["item-count"]; i++) {
    items.push(res.items[i]);
  }
  page = res["current-page"];
  renderTable();
  renderPagination();
  $(".table-data").removeClass("table-loading");
  $(".table-data").addClass("table-loaded");
}

function renderHead() {
  $('.table-name').text(setTableName());
  $(".table-fields thead").html(renderTableHead());
}

async function initialLoading() {
  $(".table-load-trigger").prop("disabled", true);
  $(".table-load-trigger").toggleClass("btn-primary btn-secondary");
  renderHead();
  await tableLoadData();
  $(".table-load-trigger").prop("disabled", false);
  $(".table-load-trigger").toggleClass("btn-primary btn-secondary");
}

async function switchPage(nextPage) {
  nextPage = nextPage.trim();
  if (nextPage == "Next") {
    page++;
  } else if (nextPage == "Previous") {
    page--;
  } else {
    page = parseInt(nextPage);
  }
  await tableLoadData();
}

$(".table-load-trigger").click(async function (e) {
  e.preventDefault();

  $(this).prop("disabled", true);
  $(this).toggleClass("btn-primary btn-secondary");
  $(".table-load-trigger i").toggleClass("fa-spin");
  await tableLoadData();
  $(this).prop("disabled", false);
  $(this).toggleClass("btn-primary btn-secondary");
  $(".table-load-trigger i").toggleClass("fa-spin");
});

$(document).ready(async function () {
  limit = setLimit();
  if(limit <= 0){
    limit = 1
  }
  displayPage = setDisplayPage();
  if(displayPage <= 0 ){
    displayPage = 1;
  }
  page = initialPage();
  if(page <= 0){
    page = 1;
  }
  await initialLoading();
});

class NotImplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotImplementedError";
  }
}

function setTableName(){
  throw new NotImplementedError();
}

function renderTableRow(item) {
  throw new NotImplementedError();
}

function setLimit() {
  throw new NotImplementedError();
}

function setDisplayPage(){
  throw new NotImplementedError();
}

function initialPage(){
  throw new NotImplementedError();
}

function renderTableHead(){
  throw new NotImplementedError();

}

function bindRowAction(){}

async function getItemsMethods(limit, page){
  throw new NotImplementedError();
}