import accessTokenExpiraion from "../../config/access_token_expire.js";
import {PUB_KEY } from "../../utils/cert/key_pair.js";
import User from '../user/model.js';
import AuthoriztionService from "./service.js";
import jsonwebtoken from "jsonwebtoken";
const { TokenExpiredError } = jsonwebtoken;

const AuthorizationController = {
    verifyAccessToken: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')['1'];
        if (!token) {
            return res.status(401).end('unauthorized');
        }
        jsonwebtoken.verify(token, PUB_KEY, { algorithms: 'RS256' }, async (err, data) => {
            if (err) {
                console.log(err);
                if (err instanceof TokenExpiredError) {
                    return res.status(401).end('token expired');
                }
                return res.status(401).end('invalid token');
            };
            const type = data.type;
            if (!type || type != 'access-token') {
                return res.status(401).end('invalid token');
            }
            try {
                const user = await User.findById(mongoose.Types.ObjectId(data.sub));
                // maybe check suspended status here?
                if (!user) {
                    return res.status(401).end('user not found');
                }
                req.user = user;
                next();
            } catch (e) {
                console.log(e);
                return res.status(401).end('unauthorized');
            }
        });
    },

    verifyRefreshToken: async (req, res, next) => {
        const refreshToken = req.body.token;
        if (!refreshToken) {
            return res.status(401).end('unauthorized');
        }
        jsonwebtoken.verify(refreshToken, PUB_KEY, { algorithms: 'RS256', ignoreExpiration: true }, async (err, data) => {
            if (err) {
                console.log(err);
                return res.status(401).end('invalid token');
            };
            const tokenId = data.id;
            if (!AuthoriztionService.validateRefreshToken(tokenId)) {
                return res.status(403).end('forbidden');
            }
            const type = data.type;
            if (!type || type != 'refresh-token') {
                return res.status(401).end('invalid token');
            }
            req.body.userId = data.sub;
            next();
        });
    },

    getNewAccessToken: async (req, res)=>{
        // use verifyRefreshToken before this 
        const expiredIn = accessTokenExpiraion;
        try{
           const {userId} = req.body
           if(!userId){
              throw Error('NO user Id to make new token');
           }
           const newAccessToken = AuthoriztionService.issueAccessToken(userId, expiredIn);
           res.status(200).json({
              accessToken: newAccessToken,
              expiresIn: expiredIn
           });
        }catch(e){
           res.status(500).send('something went wrong');
        }
     },


};

export default AuthorizationController;
