import TokenService from "./token_service.js";

function checkValidReq(role, useToken) {
  if (!["user", "admin", "public"].includes(role)) {
    throw new Error("role not specified");
  }
  if (role == "public" && useToken) {
    throw new Error("public role don't need token");
  }
  if ((role == "admin" || role == "user") && !useToken) {
    throw new Error("if you don't need token, use public role instead");
  }
  // public: not include header
  // user: include user tokens
  // admin: include admin tokens
}

function headerAuthFormat(token) {
  const header = { authorization: `Bearer ${token}` };
  return header;
}

async function tokenReset(role) {
  try {
    const refreshToken = TokenService.refreshToken.get(role);
    const res = await axios.get("/api/v1/auth/token", {
      headers: headerAuthFormat(refreshToken),
    });
    const tokens = res.data;
    const newAccessToken = tokens.accessToken;
    const newRefreshToken = tokens.refreshToken;
    TokenService.accessToken.set(role, newAccessToken);
    TokenService.refreshToken.set(role, newRefreshToken);
  } catch (err) {
    console.log(err);
    throw new Error("invalid refresh-token");
  }
}

async function request(
  url,
  params,
  body,
  headers,
  method,
  role,
  useToken,
  token
) {
  checkValidReq(role, useToken);
  let reqHeaders;
  if (useToken) {
    let reqToken = TokenService.accessToken.get(role);
    if (token) {
      reqToken = token;
    }
    reqHeaders = { ...headers, ...headerAuthFormat(reqToken) };
  }
  const request = {
    method: method,
    headers: reqHeaders,
    data: body,
    url: url,
    params: params,
  };
  try {
    const res = await axios(request);
    return res;
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.msg;
    } catch (err) {
      errMsg = "something went wrong";
    }
    if (!useToken) {
      throw new Error(errMsg);
    }
    await tokenReset(role);
    let reqToken = TokenService.accessToken.get(role);
    if (token) {
      reqToken = token;
    }
    reqHeaders = { ...headers, ...headerAuthFormat(reqToken) };
    request.headers = reqHeaders;
    const res = await axios(request);
    return res;
  }
}

const Request = {
  get: async ({
    url,
    params = {},
    body = {},
    headers = {},
    role = "public",
    useToken = false,
    token = null,
  } = {}) => {
    return await request(
      url,
      params,
      body,
      headers,
      "get",
      role,
      useToken,
      token
    );
  },
  put: async ({
    url,
    params = {},
    body = {},
    headers = {},
    role = "public",
    useToken = false,
    token = null,
  } = {}) => {
    return await request(
      url,
      params,
      body,
      headers,
      "put",
      role,
      useToken,
      token
    );
  },
  post: async ({
    url,
    params = {},
    body = {},
    headers = {},
    role = "public",
    useToken = false,
    token = null,
  } = {}) => {
    return await request(
      url,
      params,
      body,
      headers,
      "post",
      role,
      useToken,
      token
    );
  },
  delete: async ({
    url,
    params = {},
    body = {},
    headers = {},
    role = "public",
    useToken = false,
    token = null,
  } = {}) => {
    return await request(
      url,
      params,
      body,
      headers,
      "delete",
      role,
      useToken,
      token
    );
  },
};

export default Request;
