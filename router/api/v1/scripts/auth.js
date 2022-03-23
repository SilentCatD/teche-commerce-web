import express from "express";
import AuthenticationController from "../../../../components/authentication/controller.js";
import AuthorizationController from "../../../../components/authorization/controller.js";
const authRouter = express.Router();

authRouter.route('/login').get(AuthenticationController.login);
authRouter.route('/register').post(AuthenticationController.registerUser);
authRouter.route('/register-admin').post(AuthorizationController.verifyAccessToken, AuthorizationController.isAdmin, AuthenticationController.registerAdmin);

export default authRouter;