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
    if (res.data.role != role && res.data.role != "admin") {
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
  requestResetPassword: async (email) => {
    const url = "/api/v1/auth/send-reset-password-email";
    const body = {
      email: email,
    };
    await Request.post({
      url: url,
      role: "public",
      body: body,
    });
  },
  verifyResetPassword: async (hash, password) => {
    const url = `/api/v1/auth/reset-password/${hash}`;
    const body = {
      password: password,
    };
    await Request.put({
      url: url,
      role: "public",
      body: body,
    });
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

  fetchAllAccounts: async ({
    page,
    limit,
    sort = "createdAt",
    order_by = "desc",
    query,
    role,
    active
  }={}) => {
    const searchParams = queryAllParamsFormat(page, limit, sort, order_by, null, null, null, query);
    if(role){
      searchParams.set('role', role);
    }
    if(active){
      searchParams.set('active', active);
    }
    console.log(searchParams.toString());
    const url = "/api/v1/account";
    const res = await Request.get({ url: url, params: searchParams, useToken: true });
    return res.data.data;
  },

  getRole: async () => {
    const url = "/api/v1/auth/role";
    const res = await Request.get({ url: url, useToken: true });
    return res.data.data;
  },

  userInfo: async () => {
    const url = `/api/v1/user/`;
    let res = await Request.get({ url: url, useToken: true });
    return res.data.data;
  },
  userInfoEdit: async ({ name, oldPassword, newPassword, imgFile } = {}) => {
    try {
      const formData = new FormData();
      if (imgFile) {
        formData.append("image", imgFile);
      }
      if (name) {
        formData.append("name", name);
      }
      if (oldPassword) {
        formData.append("oldPassword", oldPassword);
      }
      if (newPassword) {
        formData.append("newPassword", newPassword);
      }
      const url = "/api/v1/user";
      let res = await Request.post({
        url: url,
        body: formData,
        useToken: true,
      });
      return res.data;
    } catch (e) {
      throw e;
    }
  },
  haveTokens: () => {
    const token = TokenService.refreshToken.get();
    if (token) return true;
    return false;
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
    brands,
    categories,
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
    if (brands)
      brands.forEach((brand) => {
        searchParams.append("brands", brand);
      });
    if (categories)
      categories.forEach((category) => {
        searchParams.append("categories", category);
      });
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
  fetchAllComment: async (
    productId,
    {
      page,
      limit,
      sort = "createdAt",
      order_by = "desc",
      range_field,
      min,
      max,
    } = {}
  ) => {
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
    await Request.put({ url, body, headers, useToken: true });
  },

  fetchProduct: async (id) => {
    const url = `/api/v1/product/${id}`;
    const res = await Request.get({ url });
    return res.data.data;
  },

  getRelatedProduct: async(id, limit) => {
    const url = `/api/v1/product/${id}/related`;
    const params = {limit};
    const res = await Request.get({ url,params });
    return res.data.data;
  },

  createBrand: async ({ brandName, imgFile }) => {
    let formData = new FormData();
    if (imgFile) {
      formData.append("image", imgFile);
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
    await Request.delete({ url, useToken: true });
  },
  createCategory: async ({ categoryName }) => {
    const body = { categoryName };
    const url = "/api/v1/category";
    await Request.post({ url, body, useToken: true });
  },

  deleteCategory: async (id) => {
    const url = `/api/v1/category/${id}`;
    await Request.delete({ url, useToken: true });
  },

  createComment: async (productId, rating, description) => {
    const body = { productId, rating, description };
    const url = "/api/v1/comment";
    await Request.post({ url, body, useToken: true });
  },

  editComment: async (productId, commentId, rating, description) => {
    const body = { productId, rating, description };
    const url = `/api/v1/comment/${commentId}`;
    await Request.put({ url, body, useToken: true });
  },

  deleteComment: async (commentId) => {
    const url = `/api/v1/comment/${commentId}`;
    await Request.delete({ url, useToken: true });
  },

  createAdminAccount: async (email, name, password) => {
    const url = `/api/v1/auth/register-admin`;
    const body = { email, name, password };
    await Request.post({ url, body, useToken: true });
  },
  getUserCart: async () => {
    const url = "/api/v1/cart";
    const response = await Request.get({ url, useToken: true });
    return response.data;
  },
  getUserCartInfo: async () => {
    const url = "/api/v1/cart/basic";
    const response = await Request.get({ url, useToken: true });
    return response.data.data;
  },
  addCartItem: async (productId, amount) => {
    const url = "/api/v1/cart";
    const body = { productId, amount };
    await Request.post({ url, body, useToken: true });
  },
  increaseCartItem: async (productId) => {
    const url = "/api/v1/cart";
    const body = { productId, amount: 1 };
    await Request.post({ url, body, useToken: true });
  },
  decreaseCartItem: async (productId, amount) => {
    const url = "/api/v1/cart";
    const body = { productId, amount: -1 };
    await Request.post({ url, body, useToken: true });
  },
  updateCartItem: async (productId, amount) => {
    const url = "/api/v1/cart";
    const body = { productId, amount };
    await Request.put({ url, body, useToken: true });
  },
  removeCartItem: async (productId) => {
    const url = "/api/v1/cart";
    const body = { productId };
    await Request.delete({ url, body, useToken: true });
  },
  createOrder: async(delivery) => {
    const url = "/api/v1/order";
    const body = {delivery};
    await Request.post({url,body,useToken:true});
  }
};

export default APIService;
