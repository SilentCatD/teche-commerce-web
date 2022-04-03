export function validateUserEmail(elementId,elementNotifyError) {
    let email = $(`#${elementId}`).val().trim();
    if(!validator.isEmail(email)) {
        $(`#${elementNotifyError}`).text("Invalid Email format");
    }
    else {
        $(`#${elementNotifyError}`).text("");
    }
}

export function validateUserPassword(elementId,elementNotifyError) {
    let password = $(`#${elementId}`).val().trim();
    if(validator.isEmpty(password,{ignore_whitespace: true})) {
        $(`#${elementNotifyError}`).text("Password Should Not Be Empty");
    } else if(!validator.isStrongPassword(password,{ minSymbols: 0 })) {
        $(`#${elementNotifyError}`).text("Password Not Strong Enough");
    } else {
        $(`#${elementNotifyError}`).text("");
    }
}