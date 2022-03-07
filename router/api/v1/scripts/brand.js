import express from "express";
import multer from "multer";
import {
    createBrand,
    fetchAllBrand,
    deleteAllBrand,
    deleteBrand,
    fetchBrand,
} from "../../../../controller/brand.js";
const router = express.Router();
const upload = multer();
// /api/v1/brand

router
    .route("/")
    .get(fetchAllBrand)
    .post(upload.single("brandImg"), createBrand)
    .delete(deleteAllBrand);

router.route("/:id").get(fetchBrand).delete(deleteBrand);

export { router };
