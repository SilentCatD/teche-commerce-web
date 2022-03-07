import express from "express";
import multer from "multer";
import {
  BrandController
} from "../../../../controller/brand.js";
const router = express.Router();
const upload = multer();
// /api/v1/brand

router
  .route("/")
  .get(BrandController.fetchAllBrand)
  .post(upload.single("brandImg"), BrandController.createBrand)
  .delete(BrandController.deleteAllBrand);

router.route("/:id").get(BrandController.fetchBrand).delete(BrandController.deleteBrand);

export {
  router
};
