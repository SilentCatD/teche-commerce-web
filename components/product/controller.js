import ProductService from "./service.js";
import Product from "./model.js";
import Brand from "../brand/model.js";
import Category from "../category/model.js";
import CommonMiddleWares from "../common/middleware.js";
import CommomDatabaseServies from "../common/services.js";
import { param, validationResult, query } from "express-validator";
import AuthorizationController from "../authorization/controller.js";

const ProductController = {
  createProduct: [
    AuthorizationController.isAdmin,
    CommonMiddleWares.productCreateAndEditValidations,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
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
        res
          .status(201)
          .json({ success: true, msg: `product created with id ${id}` });
      } catch (e) {
        console.log(e);
        res.status(500).json({
          success: false,
          msg: `can't create product, something went wrong: ${e}`,
        });
      }
    },
  ],
  fetchAllProduct: [
    CommonMiddleWares.apiQueryParamsExtract,
    query("brand")
      .if(query("brand").exists())
      .trim()
      .custom(async (brandId) => {
        try {
          const brand = await Brand.findById(brandId);
          if (!brand) {
            throw new Error();
          }
        } catch (e) {
          throw new Error("brand not exist");
        }
        return true;
      }),
    query("category")
      .if(query("category").exists())
      .trim()
      .custom(async (categoryId) => {
        try {
          const category = await Category.findById(categoryId);
          if (!category) {
            throw new Error();
          }
        } catch (e) {
          throw new Error("category not exist");
        }
        return true;
      }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, msg: errors.array()[0].msg });
      }
      try {
        const { limit, page, sortParams, range, brand, category, query } = req.query;
        const result = await ProductService.productQueryAll(range, limit, page, sortParams, brand, category, query);
        res.status(200).json({ success: true, data: result });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],

  deleteAllProduct: [
    AuthorizationController.isAdmin,
    async (req, res) => {
      try {
        await ProductService.deleteAllProduct();
        res.status(200).json({ success: true, msg: "all Product deleted" });
      } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, msg: "something went wrong" });
      }
    },
  ],

  fetchProduct: [
    param("id")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (productId) => {
        const exist = await Product.exists({ _id: productId });
        if (!exist) {
          throw new Error("product not existed");
        }
        return true;
      }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }
        const { id } = req.params;
        const result = await ProductService.fetchProduct(id);
        res.status(200).json({ success: true, data: result });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],

  deleteProduct: [
    AuthorizationController.isAdmin,
    param("id")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (productId) => {
        const exist = await Product.exists({ _id: productId });
        if (!exist) {
          throw new Error("product not existed");
        }
        return true;
      }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array()[0].msg });
        }
        const { id } = req.params;
        await ProductService.deleteProduct(id);
        res.status(200).json({ success: true, msg: "product deleted" });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],
  editProduct: [
    AuthorizationController.isAdmin,
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
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
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
          imagesFiles
        );
        res.status(200).json({ success: true, msg: "product edited" });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],
};

export default ProductController;
