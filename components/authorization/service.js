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
        const signedAccessToken = jsonwebtoken.sign(accessTokenPayload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
        return signedAccessToken;
    },
    validateRefreshToken: async(tokenId)=>{
        const refreshToken =await RefreshToken.findOne({id: tokenId});
        if(refreshToken && refreshToken.active){
            return true;
        }
        return false;
    },

    deleteRevokedToken: async()=>{
        await RefreshToken.deleteMany({active: false});
    },

    revokeRefreshToken: async(tokenId)=>{
        const refreshToken =await RefreshToken.findOne({id: tokenId});
        if(refreshToken){
            refreshToken.active = false;
            await refreshToken.save();
        }
    },

    issueRefreshToken: async (id) => {
        const newRefreshToken = new RefreshToken({active: true});
        const refreshTokenPayload = {
            id: newRefreshToken.id,
            sub: id,
            iat: Math.floor(Date.now() / 1000),
            type: "refresh-token",
        };
        const signedRefreshToken = jsonwebtoken.sign(refreshTokenPayload, PRIV_KEY, { algorithm: 'RS256' });
        newRefreshToken.token = signedRefreshToken;
        await newRefreshToken.save();
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