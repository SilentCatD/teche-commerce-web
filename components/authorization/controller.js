import accessTokenExpiraion from "../../config/access_token_expire.js";
import AuthoriztionService from "./service.js";
import passport from "passport";

const accessTokenVerify = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const tokenType = req.authInfo.type;
    if (tokenType != "access-token") {
      return res
        .status(400)
        .json({ success: false, msg: "invalid access-token" });
    }
    next();
  },
];

const refreshTokenVerify = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const tokenType = req.authInfo.type;
      const tokenId = req.authInfo.id;
      if (!tokenId) {
        throw new Error("invalid token id");
      }
      if (tokenType != "refresh-token") {
        throw new Error("invalid token type");
      }
      const token = await AuthoriztionService.validateRefreshToken(tokenId);
      if (!token) {
        throw new Error("invalid refresh-token (revoked)");
      }
      next();
    } catch (e) {
      return res.status(400).json({ success: false, msg: e.message });
    }
  },
];

const AuthorizationController = {
  getNewAccessToken: [
    refreshTokenVerify,
    async (req, res) => {
      const expiredIn = accessTokenExpiraion;
      try {

        const newAccessToken = AuthoriztionService.issueAccessToken(
          req.user.id,
          expiredIn
        );
        return res.status(200).json({
          accessToken: newAccessToken,
          expiresIn: expiredIn,
        });
      } catch (e) {
        return res.status(500).send("something went wrong");
      }
    },
  ],

  isValidAccount: [
    // miễn là có account và đã active
    accessTokenVerify,
  ],

  isValidRefreshToken: [
    // dùng để logout
    refreshTokenVerify,
  ],

  isUser: [
    // phải là account user
    accessTokenVerify,
    async (req, res, next) => {
      const role = req.user.role;
      console.log(req.user.role);
      if (role == "user") {
        return next();
      }
      res.status(403).send("forbidden");
    },
  ],

  isAdmin: [
    // phải là account admin
    accessTokenVerify,
    async (req, res, next) => {
      const role = req.user.role;
      console.log(req.user.role);
      if (role == "admin") {
        return next();
      }
      res.status(403).send("forbidden");
    },
  ],
};

export default AuthorizationController;
