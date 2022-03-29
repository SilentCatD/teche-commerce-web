
$(document).ready(async function () {
  const currentURL = window.location.href;
  const lastSegment = currentURL.split("/").pop();

  if(lastSegment.length > 0 ) {
  $(`#header__${lastSegment}`).addClass("active");
  }
  else   $(`#header__index`).addClass("active");

  });
  