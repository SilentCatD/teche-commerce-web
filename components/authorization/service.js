import jsonwebtoken from "jsonwebtoken";
import { PRIV_KEY } from "../../utils/cert/key_pair.js";
import RefreshToken from "./model.js";

const AuthoriztionService = {
  issueAccessToken: (id, expiresIn) => {
    const accessTokenPayload = {
      sub: id,
      iat: Math.floor(Date.now() / 1000),
      type: "access-token",
    };
    const signedAccessToken = jsonwebtoken.sign(accessTokenPayload, PRIV_KEY, {
      expiresIn: expiresIn,
      algorithm: "RS256",
    });
    return signedAccessToken;
  },
  validateRefreshToken: async (tokenId) => {
    try {
      const refreshToken = await RefreshToken.findById(tokenId);
      if (refreshToken) {
        await refreshToken.remove();
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  revokeRefreshToken: async (tokenId) => {
    try {
      const refreshToken = await RefreshToken.findById(tokenId);
      if (refreshToken) {
        await refreshToken.remove();
      }
    } catch (e) {
      console.log(e);
    }
  },

  issueRefreshToken: async (userId) => {
    const newRefreshToken = new RefreshToken();
    const refreshTokenPayload = {
      id: newRefreshToken.id,
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      type: "refresh-token",
    };
    const signedRefreshToken = jsonwebtoken.sign(
      refreshTokenPayload,
      PRIV_KEY,
      { algorithm: "RS256" }
    );
    newRefreshToken.token = signedRefreshToken;
    newRefreshToken.userId = userId;
    await newRefreshToken.save();
    return signedRefreshToken;
  },

  revokeUserRefreshTokens: async (userId) => {
    // revoke all refresh token of a user
    await RefreshToken.deleteMany({ userId: userId });
  },
};

export default AuthoriztionService;
