import Request from "./request.js";
import TokenService from "./token_service.js";


async function urlToFile(url) {
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();
  const file = new File([blob], "file-name", { type: "image/jpeg" });
  return file;
}

function queryAllParamsFormat(
  page,
  limit,
  sort = "createdAt",
  order_by = "desc",
  range_field,
  min,
  max,
  query
) {
  const searchParams = new URLSearchParams();
  searchParams.set("sort", sort);
  searchParams.set("order_by", order_by);
  if (page) {
    searchParams.set("page", page);
  }
  if (limit) {
    searchParams.set("limit", limit);
  }
  if (range_field) {
    searchParams.set("range_field", range_field);
  }
  if (min) {
    searchParams.set("min", min);
  }
  if (max) {
    searchParams.set("max", max);
  }
  if (query) {
    searchParams.set("query", query);
  }
  return searchParams;
}

const APIService = {
  login: async (email, password, role) => {
    const url = "/api/v1/auth/login";
    const body = {
      email: email,
      password: password,
    };
    const res = await Request.post({
      url: url,
      body: body,
    });
    if(res.data.role!=role){
      throw new Error("you don't have enough right to access this site!");
    }
    const accessToken = res.data.accessToken;
    const refreshToken = res.data.refreshToken;
    TokenService.accessToken.set(accessToken);
    TokenService.refreshToken.set(refreshToken);
  },
  logout: async () => {
    const url = "/api/v1/auth/logout";
    try {
      await Request.get({
        useToken: true,
        url: url,
        token: TokenService.refreshToken.get(),
      });
    } catch (e) {
      console.log(e);
    } finally {
      TokenService.accessToken.del();
      TokenService.refreshToken.del();
    }
  },
  requestResetPassword: async(email) => {
    const url = "/api/v1/auth/send-reset-password-email";
    const body = {
      email: email,
    }
    await Request.post({
        url: url,
        role: "public",
        body: body,
      })
  },
  verifyResetPassword: async(hash,password) => {
    const url = `/api/v1/auth/reset-password/${hash}`;
    const body = { 
      password: password
    }
    await Request.put({
      url:url,
      role:"public",
      body: body,
    })
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

  getRole: async () => {
    const url = "/api/v1/auth/role";
    const res = await Request.get({ url: url, useToken: true});
    return res.data.data;
  },

  userInfo: async () => {
    const url = "/api/v1/user";
    let res = await Request.get({ url: url, useToken: true});
    return res.data.data;
  },
  userInfoEdit: async (userInfo) => {
    try {
      const url = "/api/v1/user";
      const body = userInfo;
      // header is using automagic
      let res = await Request.post({
        url: url,
        body: body,
        useToken: true,
      });
      return res.data;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  },
  haveTokens: async () => {
    const token = TokenService.refreshToken.get();
    if (token) return true;
  },
  createProduct: async ({
    productName,
    productDetails,
    productPrice,
    productUnit,
    productBrand,
    productCategory,
    productsImages,
  }) => {
    let formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDetails", productDetails);
    formData.append("productPrice", productPrice);
    formData.append("productUnit", productUnit);
    formData.append("productBrand", productBrand);
    formData.append("productCategory", productCategory);
    productsImages.forEach((file) => {
      formData.append("images", file);
    });
    const url = "/api/v1/product";
    const body = formData;
    const headers = { "Content-Type": "multipart/form-data" };
    const res = await Request.post({
      url: url,
      body: body,
      headers: headers,
      useToken: true,
    });
  },

  fetchAllProduct: async ({
    page,
    limit,
    sort = "createdAt",
    order_by = "desc",
    range_field,
    min,
    max,
    brand,
    category,
    query,
  } = {}) => {
    const url = "/api/v1/product";
    const searchParams = queryAllParamsFormat(
      page,
      limit,
      sort,
      order_by,
      range_field,
      min,
      max,
      query
    );
    if (brand) {
      searchParams.set("brand", brand);
    }
    if (category) {
      searchParams.set("category", category);
    }
    const res = await Request.get({ url: url, params: searchParams });
    return res.data.data;
  },
  fetchAllBrand: async ({
    page,
    limit,
    sort = "createdAt",
    order_by = "desc",
    range_field,
    min,
    max,
    query,
  } = {}) => {
    const url = "/api/v1/brand";
    const searchParams = queryAllParamsFormat(
      page,
      limit,
      sort,
      order_by,
      range_field,
      min,
      max,
      query
    );
    const res = await Request.get({ url: url, params: searchParams });
    return res.data.data;
  },
  fetchAllCategory: async ({
    page,
    limit,
    sort = "createdAt",
    order_by = "desc",
    range_field,
    min,
    max,
    query,
  } = {}) => {
    const url = "/api/v1/category";
    const searchParams = queryAllParamsFormat(
      page,
      limit,
      sort,
      order_by,
      range_field,
      min,
      max,
      query
    );
    const res = await Request.get({ url: url, params: searchParams });
    return res.data.data;
  },
  fetchAllComment: async ({
    productId,
    page,
    limit,
    sort = "createdAt",
    order_by = "desc",
    range_field,
    min,
    max,
  } = {}) => {
    const url = `/api/v1/comment/${productId}`;
    const searchParams = queryAllParamsFormat(
      page,
      limit,
      sort,
      order_by,
      range_field,
      min,
      max
    );
    const res = await Request.get({ url: url, params: searchParams });
    return res.data.data;
  },
  deleteProduct: async (id) => {
    const url = `/api/v1/product/${id}`;
    await Request.delete({ url, useToken: true });
  },

  editProduct: async ({
    id,
    productName,
    productDetails,
    productPrice,
    productUnit,
    productBrand,
    productCategory,
    productsImages,
  }) => {
    let formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDetails", productDetails);
    formData.append("productPrice", productPrice);
    formData.append("productUnit", productUnit);
    formData.append("productBrand", productBrand);
    formData.append("productCategory", productCategory);
    for (let i = 0; i < productsImages.length; i++) {
      if (productsImages[i] instanceof File) {
      } else {
        productsImages[i] = await urlToFile(productsImages[i]);
      }
      formData.append("images", productsImages[i]);
    }
    const url = `/api/v1/product/${id}`;
    const body = formData;
    const headers = { "Content-Type": "multipart/form-data" };
    await Request.put({ url, body, headers,  useToken: true });
  },

  fetchProduct: async (id) => {
    const url = `/api/v1/product/${id}`;
    const res = await Request.get({ url });
    return res.data.data;
  },

  createBrand: async ({ brandName, imgFile }) => {
    let formData = new FormData();
    if (imgFile) {
      formData.append("images", imgFile);
    }
    formData.append("brandName", brandName);
    const url = "/api/v1/brand";
    const body = formData;
    const headers = { "Content-Type": "multipart/form-data" };
    await Request.post({
      url: url,
      body,
      headers,
      useToken: true,
    });
  },
  deleteBrand: async (id) => {
    const url = `/api/v1/brand/${id}`;
    await Request.delete({ url,  useToken: true });
  },
  createCategory: async ({ categoryName }) => {
    const body = { categoryName };
    const url = "/api/v1/category";
    await Request.post({ url, body,  useToken: true });
  },

  deleteCategory: async (id) => {
    const url = `/api/v1/category/${id}`;
    await Request.delete({ url,  useToken: true });
  },

  createComment: async(productId, rating,description) => {
    const body = {productId,rating,description};
    const url = "/api/v1/comment";
    console.log(body);
    await Request.post({url,body,useToken:true});
  },

  createAdminAccount: async (email, name, password) => {
    const url = `/api/v1/auth/register-admin`;
    const body = { email, name, password };
    await Request.post({ url, body, useToken: true});
  },
};

export default APIService;
