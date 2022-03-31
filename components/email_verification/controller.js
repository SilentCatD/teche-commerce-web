import { param, validationResult, body } from "express-validator";
import User from "../user/model.js";
import { ResetPasswordRequest, UnactivatedAccount } from "./model.js";
import EmailVerificationService from "./service.js";

const EmailVerificationController = {
  sendResetPasswordEmail: [
    body("email")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isEmail()
      .withMessage("not a valid email format")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("user not registerd");
        }
        return true;
      }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      EmailVerificationService.sendResetPasswordEmail(email);
      res.status(200).end("email sent");
    },
  ],

  resendActivationEmail: [
    body("email")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isEmail()
      .withMessage("not a valid email format")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("user not registerd");
        }
        if (user.active) {
          throw new Error("this email already been activated");
        }
        return true;
      }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      EmailVerificationService.sendVerificationEmail(email);
      res.status(200).end("email sent");
    },
  ],
  verifyEmail: [
    param("hash")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (hash) => {
        const na_account = await UnactivatedAccount.findOne({ hash: hash });
        if (!na_account) {
          throw new Error("account entries not found");
        }
        const user = await User.findById(na_account.userId);
        if (!user) {
          throw new Error("account not exist in database");
        }
        if (user.active) {
          throw new Error("account already been activated");
        }
        return true;
      }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { hash } = req.params;
      await EmailVerificationService.activateUserAccount(hash);
      res.status(200).end("account activated");
    },
  ],

  sendResetPassword: [
    param("hash")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (hash) => {
        const request = await ResetPasswordRequest.findOne({ hash: hash });
        if (!request) {
          throw new Error("account entries not found");
        }
        const user = await User.findById(request.userId);
        if (!user) {
          throw new Error("account not exist in database");
        }
        return true;
      }),
    body("password")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isStrongPassword({ minSymbols: 0 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { hash , password} = req.params;
      await EmailVerificationService.resetUserPassword(hash, password);
      res.status(200).end("password reset ok");
    },
  ],
};

export default EmailVerificationController;
