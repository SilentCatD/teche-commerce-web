import express from "express";
import multer from "multer";
import {
  BranchController
} from "../../../../controller/brand.js";
const router = express.Router();
const upload = multer();
// /api/v1/brand

router
  .route("/")
  .get(BranchController.fetchAllBrand)
  .post(upload.single("brandImg"), BranchController.createBrand)
  .delete(BranchController.deleteAllBrand);

router.route("/:id").get(BranchController.fetchBrand).delete(BranchController.deleteBrand);

export {
  router
};
