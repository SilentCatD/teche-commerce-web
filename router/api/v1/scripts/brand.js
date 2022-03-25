import express from "express";
import multer from "multer";
import  BrandController from "../../../../components/brand/controller.js";
const brandRouter = express.Router();
const upload = multer();
// /api/v1/brand

brandRouter
  .route("/")
  .get(BrandController.fetchAllBrand)
  .post(upload.any("images"), BrandController.createBrand)
  .delete(BrandController.deleteAllBrand);

brandRouter
  .route("/:id").get(BrandController.fetchBrand)
  .delete(BrandController.deleteBrand)
  .post(upload.any('images'),BrandController.editBrand);

export default brandRouter;
