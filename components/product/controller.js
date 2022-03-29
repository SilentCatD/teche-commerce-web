import ProductService from "./service.js";
import Product from "./model.js";

import CommonMiddleWares from "../common/middleware.js";
import CommomDatabaseServies from "../common/services.js";
import { body, validationResult } from "express-validator";
import Brand from "../brand/model.js";
import Category from "../category/model.js";

const ProductController = {
  createProduct: [
    CommonMiddleWares.productCreateAndEditValidations,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const {
          productName,
          productDetails,
          productBrand,
          productCategory,
          productPrice,
          productUnit,
        } = req.body;
        let productImages = [];
        if (req.files) {
          productImages = req.files;
        }
        const id = await ProductService.createProduct(
          productName,
          productPrice,
          productUnit,
          productBrand,
          productCategory,
          productDetails,
          productImages
        );
        res.status(201).end(`Product created with id ${id}`);
      } catch (e) {
        console.log(e);
        res.status(402).end(`Can't create product, something went wrong: ${e}`);
      }
    },
  ],
  fetchAllProduct: [
    CommonMiddleWares.apiQueryValidations,
    CommonMiddleWares.apiQueryParamsExtract,
    async (req, res) => {
      try {
        const { limit, page, sortParams, range } = req.params;
        const result = await CommomDatabaseServies.queryAllWithModel(
          Product,
          ProductService,
          limit,
          page,
          sortParams,
          range
        );
        res.status(200).json(result);
      } catch (e) {
        console.log(e);
        res.status(404).end("Not Found");
      }
    },
  ],

  deleteAllProduct: async (req, res) => {
    try {
      await ProductService.deleteAllProduct();
      res.status(200).end("All Product deleted");
    } catch (e) {
      console.log(e);
      res.status(404).end("Failed to delete all product, try again");
    }
  },

  fetchProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ProductService.fetchProduct(id);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.status(200).end(JSON.stringify(result));
    } catch (e) {
      console.log(e);
      res.status(404).end("Product not exist");
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      res.status(200).end("Delete success");
    } catch (e) {
      console.log(e);
      res.status(404).end("Product can not delete");
    }
  },
  editProduct: [
    CommonMiddleWares.productCreateAndEditValidations,
    async (req, res) => {
    try {
      const {
        productName,
        productDetails,
        productBrand,
        productCategory,
        productUnit,
        productPrice,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const imagesFiles = req.files;
      await ProductService.editProduct(
        id,
        productName,
        productPrice,
        productUnit,
        productBrand,
        productCategory,
        productDetails,
        imagesFiles,
      );
      res.status(200).end("Edit Product successfully");
    } catch (e) {
      console.log(e);
      res.status(404).end(e.message);
    }
  }],
};

export default ProductController;
