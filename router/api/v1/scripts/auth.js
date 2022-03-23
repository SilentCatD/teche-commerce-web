import express from "express";
import AuthenticationController from "../../../../components/authentication/controller.js";
const authRouter = express.Router();

authRouter.route('/login').get(AuthenticationController.login);
authRouter.route('/register').post(AuthenticationController.register);

export default authRouter;