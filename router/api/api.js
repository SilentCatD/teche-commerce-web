import express from "express";
import apiV1Router from "./v1/v1.js";

const apiRouter = express.Router({mergeParams: true});

apiRouter.use('/v1', apiV1Router);

export default apiRouter;