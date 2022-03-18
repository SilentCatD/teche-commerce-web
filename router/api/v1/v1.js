import express from "express";
import brandRouter from "./scripts/brand.js";

const apiV1Router = express.Router();

apiV1Router.use('/brand', brandRouter);
export default apiV1Router;
