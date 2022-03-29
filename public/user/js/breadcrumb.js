function setBreadCrumb(Page, ProductName) {
  if(ProductName) {
    $('#breadcrumb_name').text(ProductName);
    $('.breadcrumb__option').append(
      `<a href="/${Page.toLowerCase()}">${Page}</a>
      <span>${ProductName}</>`
    );
  }else {
    $('#breadcrumb_name').text(Page);
    $('.breadcrumb__option').append(
      `<span>${Page}</span>`
    );
  }
}