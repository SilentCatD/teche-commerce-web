$('#add-brand-btn').click(function (e) { 
    e.preventDefault();
    
    const brandNameVal = $('#add-brand-name').val();
    const imgFile = $('#add-brand-img').prop('files')[0];

    if (!brandNameVal){
        $('#add-brand-name-error').text("Must provide a valid brand name");
        return;
    }
    $('#add-brand-name-error').text("");
    if(imgFile){
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


async function addBrand(name, img){
    let formData = new FormData();
    formData.append('brandName', name);
    formData.append('brandImg', img); 
    try{
        let res = await axios({
            method: "post",
            url: "/api/v1/brand",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });
          $('#db-res').text(res.data);
    } catch (e){
        $('#db-res').text(e);
    }
    $('#add-brand-name').val("");
    $('#add-brand-img').val("");
}