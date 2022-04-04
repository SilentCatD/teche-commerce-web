import APIService from "./api_service.js";
import TokenService from "./token_service.js";

const cacheKey = {
  adminEmailKey: "admin-email-cache",
  adminPwdKey: "admin-pwd-cache",
  adminRememberMe: "admin-remember-me",
  adminAutoLogin: "admin-auto-login",
};

async function sleep(ms, callback = null) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (typeof callback == "function") {
    callback();
  }
}

function clearCache({ role = "both", form = true, autoLogin = true }) {
  if (role == "admin" || role == "both") {
    TokenService.accessToken.del("admin");
    TokenService.refreshToken.del("admin");
    if (form) {
      localStorage.removeItem(cacheKey.adminEmailKey);
      localStorage.removeItem(cacheKey.adminPwdKey);
      localStorage.removeItem(cacheKey.adminRememberMe);
    }
    if (autoLogin) {
      localStorage.removeItem(cacheKey.adminAutoLogin);
    }
  }

  if (role == "user" || role == "both") {
    TokenService.accessToken.del("user");
    TokenService.refreshToken.del("user");
  }
}

function backToLogin(role, router) {
  clearCache({ role: role, form: false, autoLogin: true });
  window.location.replace(router);
}


async function goBackToLoginIfNotAdmin(){
  const isAdmin = await APIService.isAdmin();
  if (!isAdmin) {
    backToLogin("admin", "/admin");
  }
}

export { cacheKey, sleep, clearCache, backToLogin, goBackToLoginIfNotAdmin};
