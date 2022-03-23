import express from "express";
import authRouter from "./scripts/auth.js";
import brandRouter from "./scripts/brand.js";
import categoryRouter from "./scripts/category.js";
import productRouter from "./scripts/product.js";

const apiV1Router = express.Router();

apiV1Router.use('/brand', brandRouter);
apiV1Router.use('/category', categoryRouter);
apiV1Router.use('/product', productRouter);
apiV1Router.use('/auth', authRouter);
export default apiV1Router;
