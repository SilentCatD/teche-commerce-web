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
