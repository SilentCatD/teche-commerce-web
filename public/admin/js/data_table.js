const limit = 15;
let page = 1;
let totalPage;
const displayPage = 5;
let items = [];

function renderTable() {
  $(".table-fields tbody").html("");
  for (let row = 0; row < items.length; row++) {
    $(".table-fields tbody:last-child").append(
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


function renderPagination() {
  const pages = [];
  if (page != 1) {
    pages.push(`<li class="page-item"><a class="page-link">Previous</a></li>`);
  }
  let generated = 0;
  let curr = page - 2;
  while (generated < displayPage) {
    if (curr > totalPage) {
      break;
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
  let res = await axios({
    method: "get",
    url: `/api/v1/category?limit=${limit}&page=${page}`,
  });
  items = [];
  totalPage = res.data["total-pages"];
  for (let i = 0; i < res.data["item-count"]; i++) {
    items.push(res.data.items[i]);
  }
  page = res.data["current-page"];
  renderTable();
  renderPagination();
  $(".table-data").removeClass("table-loading");
  $(".table-data").addClass("table-loaded");
}

async function initialLoading() {
  $(".table-load-trigger").prop("disabled", true);
  $(".table-load-trigger").toggleClass("btn-primary btn-secondary");
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
  await tableLoadData();
  $(this).prop("disabled", false);
  $(this).toggleClass("btn-primary btn-secondary");
});

$(document).ready(async function () {
  await initialLoading();
});

