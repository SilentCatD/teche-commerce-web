import APIService from "../../utils/api_service.js";

let userInfo;

if(APIService.haveTokens()) {
    console.log("Virgin");
    userInfo = await APIService.userInfo();
} 

export async function getUserInfo() {
    if(userInfo) {
        console.log("Non-virgin");
        return userInfo;
    }
    if(APIService.haveTokens()) {
        console.log("Virgin");
        userInfo = await APIService.userInfo();
    } 
    return userInfo;
}