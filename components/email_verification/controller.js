import { param, validationResult , body} from "express-validator";
import EmailVerificationService from "./service.js";

const EmailVerificationController = {
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
};

export default EmailVerificationController;
