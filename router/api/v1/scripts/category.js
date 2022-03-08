import express from "express";
import  CategoryController from "../../../../controller/category.js";
const router = express.Router();
// /api/v1/brand

router
  .route("/")
  .get(CategoryController.fetchAllCategory)
  .post(CategoryController.createCategory)
  .delete(CategoryController.deleteAllCategory);

router.route("/:id").get(CategoryController.fetchCategory).delete(CategoryController.deleteCategory);

export {
  router
};
