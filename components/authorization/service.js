import jsonwebtoken from "jsonwebtoken";
import database from "../database/database";

const AuthoriztionService = {
    addRefreshToken: async (token) => {
        await database.instance.addRefreshToken(token);
    },

    revokeRefreshToken: async (token) => {
        await database.instance.removeRefreshToken(token);
    },

    validateRefreshToken: async (token) => {
        const result = await database.instance.isValidRefreshToken(token);
        return result;
    },

    issueAccessToken: (id, expiresIn) => {
        const accessTokenPayload = {
            sub: id,
            iat: Math.floor(Date.now() / 1000),
            type: "access-token",
        };
        const signedAccessToken = jsonwebtoken.sign(accessTokenPayload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
        return signedAccessToken;
    },

    issueRefreshToken: async (id) => {
        const refreshTokenPayload = {
            sub: id,
            iat: Math.floor(Date.now() / 1000),
            type: "refresh-token",
        };
        const signedRefreshToken = jsonwebtoken.sign(refreshTokenPayload, PRIV_KEY, { algorithm: 'RS256' });
        await AuthoriztionService.addRefreshToken(signedRefreshToken);
        return signedRefreshToken;
    },

    issueJWTToken: async (id, expiresIn) => {
        const signedRefreshToken =await  AuthoriztionService.issueRefreshToken(id);
        const signedAccessToken =  AuthoriztionService.issueAccessToken(id, expiresIn);
        return {
            accessToken: signedAccessToken,
            refreshToken: signedRefreshToken,
            expiresIn: expiresIn
        }
    },
}


export default AuthoriztionService;