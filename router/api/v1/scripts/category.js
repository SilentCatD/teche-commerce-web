import express from "express";
import CategoryController from "../../../../components/category/controller.js";
import {body} from 'express-validator';

const categoryRouter = express.Router();


categoryRouter
  .route("/")
  .get(CategoryController.fetchAllCategory)
  .post(body('categoryName').isByteLength({min: 3, max: 50}), body('categoryName').not().isEmpty({ignore_whitespace: true}) ,CategoryController.createCategory)
  .delete(CategoryController.deleteAllCategory);

categoryRouter.route("/:id")
  .get(CategoryController.fetchCategory)
  .delete(CategoryController.deleteCategory)
  .post(CategoryController.editCategory);

export default categoryRouter;