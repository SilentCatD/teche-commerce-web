import ProductService from "./service.js";
import Product from "./model.js";

import CommonMiddleWares from "../common/middleware.js";
import CommomDatabaseServies from "../common/services.js";
import { body, validationResult } from "express-validator";
import Brand from "../brand/model.js";
import Category from "../category/model.js";

const ProductController = {
  createProduct: [
    body("productName")
      .exists()
      .bail()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("field can't be emtpy")
      .bail()
      .isByteLength({ min: 3, max: 50 })
      .withMessage("character of field must be in range 3-50")
      .trim(),
    body("productPrice")
      .exists()
      .bail()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .isNumeric()
      .withMessage("field must be numeric value")
      .toFloat(),
    body("productUnit")
      .exists()
      .bail()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .isInt()
      .withMessage("field must be integer")
      .toInt(),
    body("productBrand")
      .exists()
      .bail()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (id) => {
        const exist = await Brand.exists({ _id: id });
        if (!exist) {
          throw new Error("brand not exist");
        }
        return true;
      }),
    body("productCategory")
      .exists()
      .bail()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (id) => {
        const exist = await Category.exists({ _id: id });
        if (!exist) {
          throw new Error("category not exist");
        }
        return true;
      }),
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
  editProduct: async (req, res) => {
    try {
      const {
        productName,
        productDetails,
        productBrand,
        productCategory,
        productPrice,
      } = req.body;
      const { id } = req.params;
      let productImages = undefined;
      if (req.files.length > 0) {
        console.log(req.files);
        productImages = req.files;
      }
      await ProductService.editProduct(
        id,
        productName,
        productPrice,
        productBrand,
        productCategory,
        productDetails,
        productImages
      );
      res.status(200).end("Edit Product successfully");
    } catch (e) {
      console.log(e);
      res.status(404).end(e.message);
    }
  },
};

export default ProductController;
