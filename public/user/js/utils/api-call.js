import authentication from "./auth.js";

const API_CALL = {
  // tested
  loginRequest: async (userInfo) => {
    let res = await usingForEveryFuckingRequest(
      "post",
      "login",
      userInfo,
      null
    ); // 200 | sucess)
    return res;
  },
  // tested
  registerUserRequest: async (userInfo) => {
    // tested
    let res = await usingForEveryFuckingRequest(
      "post",
      "register",
      userInfo,
      null
    ); // 200 | sucess)
    return res;
  },
  // tested
  newAccessTokenRequest: async () => {
    let res = await usingForEveryFuckingRequest(
      "get",
      "token",
      null,
      authentication.getRefreshToken()
    ); // 200 | sucess)
    return res;
  },
  // tested (i am lie)
  logoutRequest: async () => {
    let res = await usingForEveryFuckingRequest(
      "get",
      "logout",
      null,
      authentication.getRefreshToken()
    ); // 200 | sucess)
    return res;
  },
  // not tested
  resendActiveAccountRequest: async (userInfo) => {
    let res = await usingForEveryFuckingRequest(
      "post",
      "resend-activate-email",
      userInfo,
      null
    ); // 200 | sucess)
    return res;
  },
  // not test
  registerAdminRequest: async (userInfo) => {
    let res = await usingForEveryFuckingRequest(
      "post",
      "register-admin",
      userInfo,
      authentication.getJwtToken()
    ); // 200 | sucess)
    return res;
  },
};

async function usingForEveryFuckingRequest(type, route, userInfo, token) {
  try {
    const request = {
      method: `${type}`,
      url: `/api/v1/auth/${route}`,
      data: {},
    };
    if (userInfo) {
      if (userInfo.email) {
        request.data.email = userInfo.email;
      }
      if (userInfo.name) {
        request.data.name = userInfo.name;
      }
      if (userInfo.password) {
        request.data.password = userInfo.password;
      }
    }
    if (token) {
      request.headers = authentication.getHeaders(token);
    }
    console.log(request);
    const res = await axios(request);
    return res;
  } catch (e) {
    return e.response; // 400 validation failed | 403 wrong password
  }
}

export default API_CALL;
