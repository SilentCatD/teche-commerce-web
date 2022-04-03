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

function clearCache(role = "both") {
  if (role == "admin" || role == "both") {
    TokenService.accessToken.del("admin");
    TokenService.refreshToken.del("admin");
    localStorage.removeItem(cacheKey.adminEmailKey);
    localStorage.removeItem(cacheKey.adminPwdKey);
    localStorage.removeItem(cacheKey.adminAutoLogin);
    localStorage.removeItem(cacheKey.adminRememberMe);
  }

  if (role == "user" || role == "both") {
    TokenService.accessToken.del("user");
    TokenService.refreshToken.del("user");

  }
}

export { cacheKey, sleep, clearCache };
