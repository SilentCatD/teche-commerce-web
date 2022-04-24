import displayAlert from "./alert.js";

const modalConfig = {
  modalHeader: undefined,
  modalBody: undefined,
  modalOpName: undefined,
  operation: undefined,
};

$(document).ready(function () {
  $('#modalBody').text(modalConfig.modalBody);
  $('#modalHeader').text(modalConfig.modalHeader);
  $('#documentOperation').text(modalConfig.modalOpName);
});

function documentOperation(successText, failText) {
  $("#documentOperation").click(async function () {
    const id = $("#documentOperation").data("id");
    $("#documentOperation").removeData("id");
    try{
      await modalConfig.operation(id);
      displayAlert(true, successText);
    }
     catch(e) {
      console.log(e);
      displayAlert(false, failText);
    }
    $("#page-modal").modal("hide");
    $(".table-load-trigger").click();
  });
}

export {modalConfig, documentOperation};

