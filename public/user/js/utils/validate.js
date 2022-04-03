export function validateUserEmail(elementId,elementNotifyError) {
    let email = $(`#${elementId}`).val().trim();
    if(!validator.isEmail(email)) {
        $(`#${elementNotifyError}`).text("Invalid Email format");
    }
    else {
        $(`#${elementNotifyError}`).text("");
        return true;
    }
    return false;
}

export function validateUserName(elementId,elementNotifyError) {
    let name = $(`#${elementId}`).val().trim();
    if(validator.isEmpty(name,{ignore_whitespace: true})) {
        $(`#${elementNotifyError}`).text("Name Should Not Be Empty");
    } else if(!validator.isByteLength(name,{ min: 3 ,max:10})) {
        $(`#${elementNotifyError}`).text("Name must in range [3, 10] characters");
    } else {
        $(`#${elementNotifyError}`).text("");
        return true;
    }
    return false;
}

export function validateUserPassword(elementId,elementNotifyError) {
    let password = $(`#${elementId}`).val().trim();
    if(validator.isEmpty(password,{ignore_whitespace: true})) {
        $(`#${elementNotifyError}`).text("Password Should Not Be Empty");
    } else if(!validator.isStrongPassword(password,{ minSymbols: 0 })) {
        $(`#${elementNotifyError}`).text("Password Not Strong Enough");
    } else {
        $(`#${elementNotifyError}`).text("");
        return true;
    }
    return false;
}