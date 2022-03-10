import express from "express";
import  CategoryController from "../../../../controller/category.js";
const categoryRouter = express.Router();
// /api/v1/brand

categoryRouter
  .route("/")
  .get(CategoryController.fetchAllCategory)
  .post(CategoryController.createCategory)
  .delete(CategoryController.deleteAllCategory);

categoryRouter.route("/:id").get(CategoryController.fetchCategory).delete(CategoryController.deleteCategory);

export default categoryRouter;
