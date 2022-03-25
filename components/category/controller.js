import CategotyService from "./service.js";
import { body ,validationResult } from "express-validator";

const CategoryController = {
  createCategory: [
    body("categoryName")
      .exists()
      .bail()
      .not().isEmpty({ ignore_whitespace: true }).withMessage('field can\'t be emtpy')
      .bail()
      .isByteLength({ min: 3, max: 50 }).withMessage("character of field must be in range 3-50")
      .trim(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { categoryName } = req.body;
        const id = await CategotyService.createCategory(categoryName);
        res.status(201).end(`Category created with id ${id}`);
      } catch (e) {
        res
          .status(500)
          .end(`Can't create category, something went wrong: ${e}`);
      }
    },
  ],
  fetchAllCategory: async (req, res) => {
    try {
      const query =req.query;
      console.log(query);
      const result = await CategotyService.fetchAllCategory(query.page,query.limit,query.sort,query.type);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.status(200).end(JSON.stringify(result));
    } catch (e) {
      console.log(e);
      res.status(404).end("Not Found");
    }
  },
  fetchCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CategotyService.fetchCategory(id);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.status(200).end(JSON.stringify(result));
    } catch (e) {
      console.log(e);
      res.status(404).end("Category not exist");
    }
  },

  deleteAllCategory: async (req, res) => {
    try {
      await CategotyService.deleteAllCategory();
      res.status(200).end("All Categorys deleted");
    } catch (e) {
      console.log(e);
      res.status(404).end("Failed to delete some categories, try again");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await CategotyService.deleteCategory(id);
      res.status(200).end("Category deleted");
    } catch (e) {
      console.log(e);
      res
        .status(404)
        .end("Can't delete category, it's not exist or something went wrong");
    }
  },
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
