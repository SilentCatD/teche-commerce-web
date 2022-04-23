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

$(document).ready(function () {
  $("#success-alert").hide();
});

export default displayAlert;