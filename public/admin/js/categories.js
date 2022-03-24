$("#success-alert").hide();
$('#categorySubmit').click(async function (e) {
    e.preventDefault();
    const input = validateCategoryNameInput();
    if (input === false) return;
    toggleBtnLoading(true);
    toggleFormInput(true);
    let result = await new Promise(r => setTimeout(r, 2000));
    toggleBtnLoading(false);
    toggleFormInput(false);
    result = true;
    if(result){
        displayAlert(true);
        clearAllInput();
    } else{
        displayAlert(false);
    }
});

$('#inputCategoryName').on('input propertychange', function (e) {
    e.preventDefault();
    validateCategoryNameInput();
});

function toggleFormInput(valid){
    if(valid){
        $('#inputCategoryName').prop('disabled', true);
    }else{
        $('#inputCategoryName').prop('disabled', false);

    }
}

function toggleBtnLoading(loading){
    if(loading){
        $('#categorySubmit').prop('disabled', true);
        $('#categorySubmit').toggleClass('btn-primary btn-secondary');
        $('#btn-text').text("Adding...");
        $('#loading-spinner').toggleClass('d-none');
    }else{
        $('#categorySubmit').toggleClass('btn-primary btn-secondary');
        $('#btn-text').text("Add");
        $('#loading-spinner').toggleClass('d-none');
        $('#categorySubmit').prop('disabled', false);
    }
}

function displayAlert(result){
    if(result){
        $("#success-alert").addClass('alert-success');
        $("#success-alert > strong").text('Success!');
        $("#success-alert > span").text('Category added!')
    }else{
        $("#success-alert").addClass('alert-danger');
        $("#success-alert > strong").text('Failed!');
        $("#success-alert > span").text('Something went wrong!')
    }

    $("#success-alert").show(300).fadeTo(1000, 300).slideUp(300, function(){
        $("#success-alert").slideUp(300);
        $("#success-alert").removeClass('alert-danger');
        $("#success-alert").removeClass('alert-success');
    });
   
}



function validateCategoryNameInput() {
    const input = $('#inputCategoryName').val().trim();
    if (validator.isEmpty(input, { ignore_whitespace: true })) {
        $('#categoryErrorMsg').text("Category name can't be empty");
        $('#inputCategoryName').addClass('is-invalid');
        return false;
    }
    $('#inputCategoryName').removeClass('is-invalid');
    $('#inputCategoryName').addClass('is-valid');
    return input;
}

function clearAllInput() {
    $('#inputCategoryName').val('');
    $('#inputCategoryName').removeClass('is-valid');
}