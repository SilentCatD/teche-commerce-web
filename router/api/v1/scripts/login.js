import express from "express";
import  authController from "../../../../controller/auth.js";
const authRouter = express.Router();
// /api/v1/brand

authRouter.route("/")
    .post(authController.signup)
    .get(authController.signin);

export default authRouter;
