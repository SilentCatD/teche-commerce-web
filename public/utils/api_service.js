import Request from "./request.js";
import TokenService from "./token_service.js";

function roleAssert(role) {
  if (!["admin", "user"].includes(role)) {
    throw new Error("invalid role");
  }
}

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
  max
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

  return searchParams;
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
      role: "public",
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

  userInfo: async (role) => {
    const url  = '/api/v1/user';
    let res = await Request.get({url: url, useToken: true, role: role});
    return res.data.data;
  },
  userInfoEdit: async (role,userInfo) => {
    try {
    const url = "/api/v1/user";
    const body = userInfo;
    // header is using automagic
    let res = await Request.post({url: url,body:body, useToken: true, role:role});
    return res.data;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  },
  haveTokens: async(role) => {
    const token = TokenService.refreshToken.get(role);
    if(token) return true;
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
      role: "admin",
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
  } = {}) => {
    const url = "/api/v1/product";
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
  fetchAllBrand: async ({
    page,
    limit,
    sort = "createdAt",
    order_by = "desc",
    range_field,
    min,
    max,
  } = {}) => {
    const url = "/api/v1/brand";
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
  fetchAllCategory: async ({
    page,
    limit,
    sort = "createdAt",
    order_by = "desc",
    range_field,
    min,
    max,
  } = {}) => {
    const url = "/api/v1/category";
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
    await Request.delete({ url, role: "admin", useToken: true });
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
    await Request.put({ url, body, headers, role: "admin", useToken: true });
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
      role: "admin",
    });
  },
  deleteBrand: async (id) => {
    const url = `/api/v1/brand/${id}`;
    await Request.delete({ url, role: "admin", useToken: true });
  },
  createCategory: async ({ categoryName }) => {
    const body = { categoryName };
    const url = "/api/v1/category";
    await Request.post({ url, body, role: "admin", useToken: true });
  },

  deleteCategory: async (id) => {
    const url = `/api/v1/category/${id}`;
    await Request.delete({ url, role: "admin", useToken: true });
  },
  createAdminAccount: async (email, name, password) =>{
    const url = `/api/v1/auth/register-admin`;
    const body = {email, name, password};
    await Request.post({url, body, useToken: true, role: 'admin'});
  }
};

export default APIService;
