import APIService from "../../utils/api_service.js";
import { goBackToLoginIfNotAdmin, sleep } from "../../utils/common.js";
import {pageConfig} from '../js/data_table.js';
import displayAlert from '../js/alert.js';


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

  $('#stateSelect').change(function (e) { 
    e.preventDefault();
    let val = $(this).val().trim();
    pageConfig.state = val;
    pageConfig.page = 1;
    triggerReloadBtn();
  });

});



function triggerReloadBtn() {
  $(".table-load-trigger").trigger("click");
}



pageConfig.limit = 5;
pageConfig.displayPage = 5;
pageConfig.state = "";
pageConfig.sort = 'createdAt';
pageConfig.order_by = 'desc';

pageConfig.getItemsMethods = async () => {
    return await APIService.fetchAllOrder({page: pageConfig.page, limit: pageConfig.limit, sort: pageConfig.sort, order_by: pageConfig.order_by, state: pageConfig.state});
  };

pageConfig.tableHead =
  `<tr>
  <th scope="col">ID</th>
  <th scope="col">Created At</th>
  <th scope="col">State</th>
  <th scope="col">&nbsp;</th>
  </tr>
  `;


pageConfig.renderTableRow = (item, index) => {
  return `<tr>
  <td class="align-middle">${item.id}</td>
  <td class="align-middle">${item.createdAt}</td>
  <td class="align-middle">${item.state}</td>
  <td class="align-middle">
  <div class="dropdown position-static">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Manage
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><button class="manage-btn manage-btn-edit dropdown-item btn"  data-index='${
          index
        }'>Details</button></li>
      </ul>
    </div>
</td>
</tr>
`;
};

pageConfig.tableName= "Orders";


pageConfig.bindRowAction = () => {
  $(".manage-btn-edit").click(function (e) {
    e.preventDefault();
    const index = $(this).data("index");
    const data = pageConfig.items[index];
    $('#orderId').val(data.id);
    $("#orderCreatedAt").val(data.createdAt);
    $('#orderReciever').val(data.delivery.firstName + " " + data.delivery.lastName);
    $('#orderAddress').val(data.delivery.address + ", " + data.delivery.country);
    $('#orderPhone').val(data.delivery.phone);
    $('#orderNote').text(data.delivery.note);
    $('#orderTable tbody').html('');
    data.items.map((item, index) => {
      $('#orderTable tbody').append(`
        <tr>
          <td>${index + 1}</td>
          <td>${item.productName}</td>
          <td>${item.productPrice}</td>
          <td>${item.amount}</td>
          <td>${item.total}</td>
        </tr>`);
    });
    const options = ['new', 'processing', 'shipping', 'completed'];
    const optionsEl = [];
    options.map((option)=>{
      optionsEl.push(`
        <option ${option == data.state ? 'selected': ''} value="${option}">${option}</option>
      `)
    });
    $('#statusSelect').html(optionsEl.join('\n'));
    $('#orderSaveChange').unbind();
    $('#orderSaveChange').click(async function (e) { 
      e.preventDefault();
      const stateVal = $('#statusSelect').val();
      $("#order-modal").modal("hide");
      await updateState(data.id, stateVal);
    });
    $("#order-modal").modal("show");
  });
};

async function updateState(orderId, state){
  await APIService.changeOrderState(orderId, state);
  triggerReloadBtn();
}