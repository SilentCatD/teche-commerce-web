import express from "express";
import AuthenticationController from "../../../../components/authentication/controller.js";
import AuthorizationController from "../../../../components/authorization/controller.js";
import EmailVerificationController from "../../../../components/email_verification/controller.js";
const authRouter = express.Router();

authRouter.route('/login').post(AuthenticationController.login); // email, password
authRouter.route('/register').post(AuthenticationController.registerUser); // email, passowrd
authRouter.route('/register-admin').post(AuthenticationController.registerAdmin); // email, password
authRouter.route('/logout').get(AuthenticationController.logout); // refresh
authRouter.route('/active/:hash').get(EmailVerificationController.verifyEmail); // active account link
authRouter.route('/token').get(AuthorizationController.getNewAccessToken); // refresh
authRouter.route('/resend-activate-mail').get(EmailVerificationController.resendActivationEmail); // email
export default authRouter;