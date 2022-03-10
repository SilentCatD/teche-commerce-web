import express from "express";
import brandRouter from "./scripts/brand.js";
import imageRouter from "./scripts/image.js";
import categoryRouter from "./scripts/category.js";
import productRouter from "./scripts/product.js";


const apiV1Router = express.Router();

apiV1Router.use('/brand', brandRouter);
apiV1Router.use('/image', imageRouter);
apiV1Router.use('/category',categoryRouter);
apiV1Router.use('/product', productRouter);
export default apiV1Router;
