import APIService from "../../utils/api_service.js";

let userInfo;

if(APIService.haveTokens()) {
    console.log("Virgin");
    userInfo = await APIService.userInfo();
} 

export async function updateUserInfo() {
    userInfo = await APIService.userInfo();
}

export async function getUserInfo() {
    if(userInfo) {
        return userInfo;
    }
    if(APIService.haveTokens()) {
        userInfo = await APIService.userInfo();
    } 
    return userInfo;
}