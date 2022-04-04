import Request from "./request.js";
import TokenService from "./token_service.js";

function roleAssert(role) {
  if (!["admin", "user"].includes(role)) {
    throw new Error("invalid role");
  }
}

const APIService = {
  login: async (email, password, role) => {
    roleAssert(role);
    const url = "/api/v1/auth/login";
    const body = {
      email: email,
      password: password,
      role: role,
    };
    const res = await Request.post({
      url: url,
      body: body,
      role: role,
    });
    const accessToken = res.data.accessToken;
    const refreshToken = res.data.refreshToken;
    TokenService.accessToken.set(role, accessToken);
    TokenService.refreshToken.set(role, refreshToken);
  },
  logout: async (role) => {
    roleAssert(role);
    const url = "/api/v1/auth/logout";
    try {
      await Request.get({
        useToken: true,
        url: url,
        role: role,
        token: TokenService.refreshToken.get(role),
      });
    } catch (e) {
      console.log(e);
    } finally {
      TokenService.accessToken.del(role);
      TokenService.refreshToken.del(role);
    }
  },
  isValidAccount: async () => {
    try {
      const url = "/api/v1/auth/is-valid-account";
      await Request.get({ url: url, useToken: true });
      return true;
    } catch (e) {
      return false;
    }
  },

  isUser: async () => {
    try {
      const url = "/api/v1/auth/is-user";
      await Request.get({ url: url, useToken: true, role: "user" });
      return true;
    } catch (e) {
      return false;
    }
  },

  isAdmin: async () => {
    try {
      const url = "/api/v1/auth/is-admin";
      await Request.get({ url: url, useToken: true, role: "admin" });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  userInfo: async () => {
    const url  = '/api/v1/user';
    let res = await Request.get({url: url, useToken: true, role: "admin"});
    return res.data.data;
  },
};

export default APIService;
