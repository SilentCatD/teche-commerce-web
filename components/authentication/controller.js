import passport from "passport";
import accessTokenExpiraion from "../../config/access_token_expire.js";
import AuthoriztionService from "../authorization/service.js";
import User from "../user/model.js";
import UserService from "../user/service.js";
import AuthenticationService from "./service.js";
import { validationResult, body } from "express-validator";
import EmailVerificationService from "../email_verification/service.js";
import CommonMiddleWares from "../common/middleware.js";
import AuthorizationController from "../authorization/controller.js";

const AuthenticationController = {
  registerUser: [
    CommonMiddleWares.accountRegisterRequirement,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg});
      }
      const { email, name, password } = req.body;
      const newUser = await UserService.createUserWithRole(
        email,
        name,
        password,
        "user"
      );
      EmailVerificationService.sendVerificationEmail(email); // DON'T AWAIT THIS
      res.json({
        success: true,
        user: newUser,
      });
    },
  ],

  registerAdmin: [
    CommonMiddleWares.accountRegisterRequirement,
    AuthorizationController.isAdmin,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg });
      }
      const { email, name, password } = req.body;
      console.log(email, name, password);
      const newUser = await UserService.createUserWithRole(
        email,
        name,
        password,
        "admin"
      );
      res.json({ success: true, user: newUser });
    },
  ],

  login: [
    body("email")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isEmail()
      .withMessage("invalid email format")
      .bail()
      .trim()
      .custom(async (email) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("email not registered");
        }
        if (!user.active) {
          throw new Error("account not activated");
        }
        return true;
      }),
    body("password")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .trim(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, msg: errors.array()[0].msg });
      }
      const user = await User.findOne({ email: req.body.email });
      const isValid = AuthenticationService.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );
      if (!isValid) {
        return res
          .status(403)
          .json({ success: false, msg: "you entered the wrong password" });
      }
      const accessToken = AuthoriztionService.issueAccessToken(
        user.id,
        accessTokenExpiraion
      );
      const refreshToken = await AuthoriztionService.issueRefreshToken(user.id);
      return res.status(200).json({
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: accessTokenExpiraion,
        role: user.role,
      });
    },
  ],

  logout: [
    AuthorizationController.isValidRefreshToken,
    async (req, res) => {
      const tokenId = req.authInfo.id;
      await AuthoriztionService.revokeRefreshToken(tokenId);
      res.status(200).json({ success: true, msg: "logout success" });
    },
  ],

  getRole: [
    AuthorizationController.role,
    async (req, res) => {
      res.status(200).send({ success: true, data: req.role });
    },
  ],
  isValidAccount: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      res.status(200).send({ success: true, msg: "account is valid" });
    },
  ],

  loginByGoogleAccount: [
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res, next) => {
      const userInfo = req.user;
      let user = await User.findOne({ email: userInfo.email });
      if (!user) {
        user = await UserService.createThirdPartyUser(
          userInfo.name,
          userInfo.email
        );
      }
      const accessToken = AuthoriztionService.issueAccessToken(
        user.id,
        accessTokenExpiraion
      );
      const refreshToken = await AuthoriztionService.issueRefreshToken(user.id);
      res.data = {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: user.role,
      };
      next();
    },
  ],
};

export default AuthenticationController;
