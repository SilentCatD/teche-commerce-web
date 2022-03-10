import express from "express";
import multer from "multer";
import ProductController from "../../../../controller/product.js";
const upload = multer();

const productRouter = express.Router();

productRouter.route('/')
    .post(upload.any('images'),ProductController.createProduct)
    .get(ProductController.fetchAllProduct)
    .delete(ProductController.deleteAllProduct);

productRouter.route('/:id')
    .get(ProductController.fetchProduct)
    .delete(ProductController.deleteProduct);
export default productRouter;