import express from "express";
import CategoryController from "../../../../components/category/controller.js";

const categoryRouter = express.Router();


categoryRouter
  .route("/")
  .get(CategoryController.fetchAllCategory)
  .post(CategoryController.createCategory)
  .delete(CategoryController.deleteAllCategory);

categoryRouter.route("/:id")
  .get(CategoryController.fetchCategory)
  .delete(CategoryController.deleteCategory)
  .post(CategoryController.editCategory);

export default categoryRouter;