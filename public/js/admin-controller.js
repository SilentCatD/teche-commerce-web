async function addBrand(name, img) {
    let formData = new FormData();
    console.log(img);
    formData.append('brandName', name);
    formData.append('brandImg', img);
    try {
        let res = await axios({
            method: "post",
            url: "/api/v1/brand",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });
        $('#db-res').text(res.data);
    } catch (e) {
        $('#db-res').text(e);
    }
    $('#add-brand-name').val("");
    $('#add-brand-img').val("");
}

async function deleteBrandById(id) {
    try {
        let response = await axios({
            method: "delete",
            url: `/api/v1/brand/${id}`,
        });
        console.log(response);
        $('#db-res').text(response.data);
    }
    catch (e) {
        $('#db-res').text("Failed to delete brand");
    }
    $('#brand-id-input').val("");
}

async function addCategory(name) {
    let data = {};
    data.categoryName = name;
    try {
        let res = await axios({
            method: "post",
            url: "/api/v1/category",
            data: data
          });
        $('#db-res').text(res.data);
    } catch (e) {
        $('#db-res').text(e);
    }
    $('#add-cate-name').val("");
}

async function deleteCategoryById(id) {
    try {
        let response = await axios({
            method: "delete",
            url: `/api/v1/category/${id}`,
        });
        console.log(response);
        $('#db-res').text(response.data);
    }
    catch (e) {
        $('#db-res').text("Failed to delete category");
    }
    $('#cate-id-input').val("");
}

$('#delete-brand-btn').click(function (e) {
    e.preventDefault();
    const brandIdVal = $('#brand-id-input').val();
    if (!brandIdVal) {
        $('#brand-id-input-error').text("brand id cant be empty");
        return;
    }
    $('#brand-id-input-error').text("");
    deleteBrandById(brandIdVal);
});



$('#add-brand-btn').click(function (e) {
    e.preventDefault();

    const brandNameVal = $('#add-brand-name').val();
    const imgFile = $('#add-brand-img').prop('files')[0];

    if (!brandNameVal) {
        $('#add-brand-name-error').text("Must provide a valid brand name");
        return;
    }
    $('#add-brand-name-error').text("");
    if (imgFile) {
        const imgFileType = imgFile.type;
        const validImageTypes = ['image/jpeg', 'image/png'];
        if (!validImageTypes.includes(imgFileType)) {
            $('#add-brand-img-error').text("That's not an image");
            return;
        }
        $('#add-brand-img-error').text("");
    }
    addBrand(brandNameVal, imgFile);
});


$('#add-cate-btn').click(function (e) {
    e.preventDefault();

    const categoryNameVal = $('#add-cate-name').val();

    if (!categoryNameVal) {
        $('#add-cate-name-error').text("Must provide a valid category name");
        console.log(categoryNameVal);
        return;
    }
    $('#add-cate-name-error').text("");
    addCategory(categoryNameVal);
});

$('#delete-cate-btn').click(function (e) {
    e.preventDefault();
    const categoryIdVal = $('#cate-id-input').val();
    if (!categoryIdVal) {
        $('#cate-id-input-error').text("category id cant be empty");
        return;
    }
    $('#cate-id-input-error').text("");
    deleteCategoryById(categoryIdVal);
});
