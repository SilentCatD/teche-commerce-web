import CategotyService from "./service.js";
import { body, param, validationResult } from "express-validator";
import CommonMiddleWares from "../common/middleware.js";
import CommomDatabaseServies from "../common/services.js";
import Category from "./model.js";
import AuthorizationController from "../authorization/controller.js";

const CategoryController = {
  createCategory: [
    AuthorizationController.isAdmin,
    body("categoryName")
      .exists()
      .bail()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("field can't be emtpy")
      .bail()
      .isByteLength({ min: 3, max: 50 })
      .withMessage("character of field must be in range 3-50")
      .trim(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }
        const { categoryName } = req.body;
        const id = await CategotyService.createCategory(categoryName);
        res
          .status(201)
          .json({ success: true, msg: `category created with id ${id}` });
      } catch (e) {
        res.status(500).json({
          success: false,
          msg: `can't create category, something went wrong: ${e}`,
        });
      }
    },
  ],
  fetchAllCategory: [
    CommonMiddleWares.apiQueryParamsExtract,
    async (req, res) => {
      try {
        const { limit, page, sortParams, range, query} = req.query;
        const result = await CategotyService.categoryQueryAll(range, limit, page, sortParams, query);
        res.status(200).json({ success: true, data: result });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],
  fetchCategory: [
    param("id")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (productId) => {
        const exist = await Category.exists({ _id: productId });
        if (!exist) {
          throw new Error("category not existed");
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
        const result = await CategotyService.fetchCategory(id);
        res.status(200).json({ success: true, data: result });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],

  deleteAllCategory: [
    AuthorizationController.isAdmin,
    async (req, res) => {
      try {
        await CategotyService.deleteAllCategory();
        res.status(200).end("All Categorys deleted");
      } catch (e) {
        console.log(e);
        res.status(404).end("Failed to delete some categories, try again");
      }
    },
  ],
  deleteCategory: [
    AuthorizationController.isAdmin,
    param("id")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (productId) => {
        const exist = await Category.exists({ _id: productId });
        if (!exist) {
          throw new Error("category not existed");
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
        await CategotyService.deleteCategory(id);
        res.status(200).json({ success: true, msg: "category deleted" });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],
  editCategory: async (req, res) => {
    try {
      const { categoryName } = req.body;
      const { id } = req.params;
      await CategotyService.editCategory(id, categoryName);
      res.status(200).end("Category successfully edit");
    } catch (e) {
      console.log(e);
      res.status(404).end(e.msg);
    }
  },
};

export default CategoryController;
