function deleteDocumentOnClick(model, deleteFunction) {
  $("#documentDelete").click(async function () {
    const id = $("#documentDelete").data("id");
    $("#documentDelete").removeData("id");
    if (await deleteFunction(id)) {
      displayAlert(true, `${model} Deleted`);
    } else {
      displayAlert(false, "Something fuckup");
    }
    $("#page-modal").modal("hide");
    $(".table-load-trigger").click();
  });
}


