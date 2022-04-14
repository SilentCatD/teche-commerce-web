import express from "express";
import AuthenticationController from "../../../../components/authentication/controller.js";
import AuthorizationController from "../../../../components/authorization/controller.js";
import EmailVerificationController from "../../../../components/email_verification/controller.js";
import passport from "passport";

const authRouter = express.Router();

authRouter.route('/login').post(AuthenticationController.login); // email, password
authRouter.route('/login/facebook').get(passport.authenticate('facebook', {scope: ['email']})); // facebo

authRouter.route('/login/google').get(passport.authenticate('google', {scope: ['email','profile']}));


authRouter.route('/register').post(AuthenticationController.registerUser); // email, passowrd
authRouter.route('/register-admin').post(AuthenticationController.registerAdmin); // email, password
authRouter.route('/logout').get(AuthenticationController.logout); // refresh
authRouter.route('/token').get(AuthorizationController.getNewAccessToken); // refresh
authRouter.route('/resend-activate-email').post(EmailVerificationController.resendActivationEmail); // email
authRouter.route('/active/:hash').put(EmailVerificationController.verifyEmail); // active account hash
authRouter.route('/send-reset-password-email').post(EmailVerificationController.sendResetPasswordEmail); // email
authRouter.route('/reset-password/:hash').put(EmailVerificationController.verifyResetPassword); //hash, new password
authRouter.route('/is-admin').get(AuthenticationController.isAdmin);
authRouter.route('/is-user').get(AuthenticationController.isUser);
authRouter.route('/is-valid-account').get(AuthenticationController.isValidAccount);
export default authRouter;