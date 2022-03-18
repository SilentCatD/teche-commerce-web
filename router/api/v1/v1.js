import express from "express";
import brandRouter from "./scripts/brand.js";
import categoryRouter from "./scripts/category.js";

const apiV1Router = express.Router();

apiV1Router.use('/brand', brandRouter);
apiV1Router.use('/category', categoryRouter);
export default apiV1Router;
