import accessTokenExpiraion from "../../config/access_token_expire.js";
import AuthoriztionService from "../authorization/service.js";
import User from "../user/model.js";
import UserService from "../user/service.js";
import AuthenticationService from "./service.js";
import { validationResult } from "express-validator";
import EmailVerificationService from "../email_verification/service.js";
import CommonMiddleWares from "../common/middleware.js";
import AuthorizationController from "../authorization/controller.js";

const AuthenticationController = {
  registerUser: [
    CommonMiddleWares.accountRegisterRequirement,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const newUser = await UserService.createUserWithRole(
        email,
        password,
        "user"
      );
      EmailVerificationService.sendVerificationEmail(email, newUser.id); // DON'T AWAIT THIS
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
      const { email, password } = req.body;
      const newUser = await UserService.createUserWithRole(
        email,
        password,
        "admin"
      );
      res.json({ success: true, user: newUser });
    },
  ],

  login: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "could not find user" });
    }
    if (!user.active) {
      return res
        .status(403)
        .json({ success: false, msg: "account not activated" });
    }
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
    const refreshToken = await AuthoriztionService.issueRefreshToken(
      user.id
    );
    return res.status(200).json({
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: accessTokenExpiraion,
    });
  },

  logout: [
    AuthorizationController.isValidRefreshToken,
    async (req, res) => {
      const tokenId = req.authInfo.id;
      await AuthoriztionService.revokeRefreshToken(tokenId);
      res.status(200).end(200);
    },
  ],
};

export default AuthenticationController;
