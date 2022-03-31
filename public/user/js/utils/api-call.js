
import authentication from "./auth.js";

const API_CALL = {
  // tested
  loginRequest: async (email, password) => {
    let res = await usingForEveryFuckingRequest("post","login", email, password,null); // 200 | sucess)
    return res;
  },
  // tested
  registerUserRequest: async (email, password) => { // tested
    let res = await usingForEveryFuckingRequest("post","register", email, password,null); // 200 | sucess)
    return res;
  },
  // tested
  newTokenRequest: async () => {
    let res = await usingForEveryFuckingRequest("get","token", null, null,authentication.getRefreshToken()); // 200 | sucess)
    return res;
  },
  // tested (i am lie)
  logoutRequest: async () => {
    let res = await usingForEveryFuckingRequest("get","logout", null, null,authentication.getRefreshToken()); // 200 | sucess)
    return res;
  },
  // not tested
  resendActiveAccountRequest: async (email) => {
    let res = await usingForEveryFuckingRequest("post","resend-activate-email",email, null,null); // 200 | sucess)
    return res;
  },
  // not test
  registerAdminRequest: async (email, password) => { 
    let res = await usingForEveryFuckingRequest("post","register-admin", email, password,authentication.getJwtToken()); // 200 | sucess)
    return res;
  }
};


async function usingForEveryFuckingRequest(type,route, email, password,token) {
  try {
    const request = {
      method: `${type}`,
      url: `/api/v1/auth/${route}`,
      data: {},
    };
    if(email) {
      request.data.email = email;
    }
    if(password) {
      request.data.password = password;
    }
    if(token) {
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