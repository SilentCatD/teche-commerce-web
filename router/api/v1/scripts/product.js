import express from "express";
import multer from "multer";
import ProductController from "../../../../components/product/controller.js";

const upload = multer();

const productRouter = express.Router();

productRouter.route('/')
    .post(upload.any('images'),ProductController.createProduct)
    .get(ProductController.fetchAllProduct)
    .delete(ProductController.deleteAllProduct);

productRouter.route('/:id')
    .get(ProductController.fetchProduct)
    .delete(ProductController.deleteProduct)
    .put(upload.any('images'),ProductController.editProduct);

productRouter.get('/:id/related', ProductController.getRelatedProduct);
export default productRouter;