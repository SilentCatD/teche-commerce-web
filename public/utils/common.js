import APIService from "./api_service.js";
import TokenService from "./token_service.js";

const cacheKey = {
  emailKey: "email-cache",
  pwdKey: "pwd-cache",
  rememberMe: "remember-me",
};

async function sleep(ms, callback = null) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (typeof callback == "function") {
    callback();
  }
}

function clearCache(form = false) {
  TokenService.accessToken.del();
  TokenService.refreshToken.del();
  if (form) {
    localStorage.removeItem(cacheKey.emailKey);
    localStorage.removeItem(cacheKey.pwdKey);
    localStorage.removeItem(cacheKey.rememberMe);
  }
}

function backToLogin(router) {
  clearCache();
  window.location.replace(router);
}


async function goBackToLoginIfNotAdmin(){
  const role = await APIService.getRole();
  if (role != 'admin') {
    backToLogin("/admin");
  }
}

export { cacheKey, sleep, clearCache, backToLogin, goBackToLoginIfNotAdmin};
