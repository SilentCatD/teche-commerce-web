function getHeaders() {
  const headers = {};
  const token = getJwtToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

const API_CALL = {
  loginRequest: async (email, password) => {
    let res = await postEmailAndPassWord("login", email, password); // 200 | sucess)
    return res;
  },
  registerRequestUser: async (email, password) => {
    try {
      const request = {
        method: "post",
        url: `/api/v1/auth/register`,
        data: {
          email: email,
          password: password,
        },
      };
      let res = await axios(request); // 200 | sucess
      return res;
    } catch (e) {
      return e.response; // 400 validation failed
    }
  },
};

async function postEmailAndPassWord(type, email, password) {
  try {
    const request = {
      method: "post",
      url: `/api/v1/auth/${type}`,
      data: {
        email: email,
        password: password,
      },
    };
    const res = await axios(request);
    return res;
  } catch (e) {
    return e.response; // 400 validation failed | 403 wrong password
  }
}
