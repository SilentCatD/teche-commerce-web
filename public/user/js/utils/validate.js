export function validateUserEmail(elementId,elementNotifyError) {
    let email = $(`#${elementId}`).val().trim();
    if(validator.isEmpty(email,{ignore_whitespace: true})) {
        $(`#${elementNotifyError}`).text("Email Should Not Be Empty");
        return false;
    }
    if(!validator.isEmail(email)) {
        $(`#${elementNotifyError}`).text("Invalid Email format");
        return false;
    }

    $(`#${elementNotifyError}`).text("");
    return email;
    
}

export function validateUserName(elementId,elementNotifyError) {
    let name = $(`#${elementId}`).val().trim();
    if(validator.isEmpty(name,{ignore_whitespace: true})) {
        $(`#${elementNotifyError}`).text("Name Should Not Be Empty");
        return false;
    }
    if(!validator.isByteLength(name,{ min: 3 ,max:20})) {
        $(`#${elementNotifyError}`).text("Name must in range [3, 20] characters");
        return false;
    }  
    $(`#${elementNotifyError}`).text("");
    return name;
}

export function validateUserPassword(elementId,elementNotifyError) {
    let password = $(`#${elementId}`).val().trim();
    if(validator.isEmpty(password,{ignore_whitespace: true})) {
        $(`#${elementNotifyError}`).text("Password Should Not Be Empty");
        return false;
    }  
    if(!validator.isStrongPassword(password,{ minSymbols: 0 })) {
        $(`#${elementNotifyError}`).text("Password Not Strong Enough");
        return false;
    }  
    $(`#${elementNotifyError}`).text("");
    return password;
}
