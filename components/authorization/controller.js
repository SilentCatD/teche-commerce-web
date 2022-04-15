import accessTokenExpiraion from "../../config/access_token_expire.js";
import AuthoriztionService from "./service.js";
import passport from "passport";

const accessTokenVerify = [
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const tokenType = req.authInfo.type;
    if (tokenType != "access-token") {
      return res
        .status(403)
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
      if (tokenType != "refresh-token") {
        throw new Error("invalid token type");
      }
      if (!tokenId) {
        throw new Error("invalid token id");
      }
      const validToken = await AuthoriztionService.validateRefreshToken(tokenId);
      if (!validToken) {
        throw new Error("invalid refresh-token (revoked)");
      }
      next();
    } catch (e) {
      return res.status(403).json({ success: false, msg: e.message });
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
        const newRefreshToken = await AuthoriztionService.issueRefreshToken(
          req.user.id
        );
        return res.status(200).json({
          refreshToken: newRefreshToken,
          accessToken: newAccessToken,
          expiresIn: expiredIn,
          role: req.user.role,
        });
      } catch (e) {
        console.log(e);
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

  role: [
    accessTokenVerify,
    async (req, res, next) => {
      const role = req.user.role;
      req.role = role;
      return next();
    },
  ],

  isUser: [
    // phải là account user
    accessTokenVerify,
    async (req, res, next) => {
      const role = req.user.role;
      if (role == "user") {
        return next();
      }
      res.status(403).json({ success: false, msg: "forbidden" });
    },
  ],

  isAdmin: [
    // phải là account admin
    accessTokenVerify,
    async (req, res, next) => {
      const role = req.user.role;
      if (role == "admin") {
        return next();
      }
      res.status(403).json({ success: false, msg: "forbidden" });
    },
  ],
};

export default AuthorizationController;
