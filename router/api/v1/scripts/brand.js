import express from "express";
import multer from "multer";
import  BrandController from "../../../../controller/brand.js";
const brandRouter = express.Router();
const upload = multer();
// /api/v1/brand

brandRouter
  .route("/")
  .get(BrandController.fetchAllBrand)
  .post(upload.single("brandImg"), BrandController.createBrand)
  .delete(BrandController.deleteAllBrand);

brandRouter.route("/:id").get(BrandController.fetchBrand).delete(BrandController.deleteBrand);

export default brandRouter;
