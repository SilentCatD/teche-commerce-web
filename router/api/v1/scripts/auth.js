import express from "express";
import AuthenticationController from "../../../../components/authentication/controller.js";
import EmailVerificationController from "../../../../components/email_verification/controller.js";
const authRouter = express.Router();

authRouter.route('/login').get(AuthenticationController.login);
authRouter.route('/register').post(AuthenticationController.registerUser);
authRouter.route('/register-admin').post(AuthenticationController.registerAdmin);
authRouter.route('/logout').post(AuthenticationController.logout);
authRouter.route('/active/:hash').get(EmailVerificationController.verifyEmail);
export default authRouter;