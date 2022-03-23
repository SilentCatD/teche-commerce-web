import { Router } from "express";
import { randomBytes, pbkdf2Sync } from 'crypto';
import User from "../../components/user/model.js";
import jsonwebtoken from "jsonwebtoken";
import { PRIV_KEY, PUB_KEY } from "../../utils/cert/key_pair.js";
import mongoose from "mongoose";

const {TokenExpiredError} = jsonwebtoken;
const testRouter = Router();

const refreshTokens = [];
const accessTokenExpiraion = '30s';

function genPassword(password) {
   var salt = randomBytes(32).toString('hex');
   var genHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

   return {
      salt: salt,
      hash: genHash
   };
}

function validPassword(password, hash, salt) {
   var hashVerify = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
   return hash === hashVerify;
}

function verifyRefreshToken(req, res, next) {
   const refreshToken = req.body.token;
   if (!refreshToken) {
      return res.status(401).end('unauthorized');
   }
   if(!refreshTokens.includes(refreshToken)){
      return res.status(403).end('forbidden');
   }
   jsonwebtoken.verify(refreshToken, PUB_KEY, { algorithms: 'RS256', ignoreExpiration: true}, async (err, data) => {
      if (err) { 
         console.log(err);
         return res.status(401).end('invalid token');
      };
      const type = data.type;
      if(!type || type !='refresh-token'){
         return res.status(401).end('invalid token');
      }
      req.body.userId = data.sub;
      next();
   });
}



function issueAccessToken(id, expiresIn){
   const accessTokenPayload = {
      sub: id,
      iat: Math.floor(Date.now() / 1000),
      type: "access-token",
   };
   const signedAccessToken = jsonwebtoken.sign(accessTokenPayload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
   return signedAccessToken;
}


function issueRefreshToken(id){
   const refreshTokenPayload = {
      sub: id,
      iat: Math.floor(Date.now() / 1000),
      type: "refresh-token",
   };
   const signedRefreshToken = jsonwebtoken.sign(refreshTokenPayload, PRIV_KEY, {algorithm: 'RS256' });
   refreshTokens.push(signedRefreshToken);
   return signedRefreshToken;
}


function issueJWTToken(id, expiresIn=accessTokenExpiraion) {
   const signedRefreshToken = issueRefreshToken(id);
   const signedAccessToken = issueAccessToken(id, expiresIn);
   return {
      accessToken: signedAccessToken,
      refreshToken: signedRefreshToken, 
      expiresIn: expiresIn
   }
}

testRouter.get('/token', verifyRefreshToken, async (req, res)=>{
   try{
      const {userId} = req.body
      if(!userId){
         throw Error('NO user Id to make new token');
      }
      const newAccessToken = issueAccessToken(userId, accessTokenExpiraion);
      res.status(200).json({
         accessToken: newAccessToken,
         expiresIn: accessTokenExpiraion
      });
   }catch(e){
      res.status(500).send('something went wrong');
   }
 
});

testRouter.post('/register', async (req, res) => {
   const saltHash = genPassword(req.body.password);

   const salt = saltHash.salt;
   const hash = saltHash.hash;

   const newUser = new User({
      email: req.body.email,
      hash: hash,
      salt: salt,
      role: 'user',
   });
   await newUser.save();
   res.json({ success: true, user: newUser });
});


testRouter.get('/login', async (req, res) => {
   const user = await User.findOne({ email: req.body.email });
   if (!user) {
      return res.status(401).json({ success: false, msg: "could not find user" });
   }
   const isValid = validPassword(req.body.password, user.hash, user.salt);
   if (isValid) {
      const tokenObject = issueJWTToken(user._id);
      res.status(200).json({ success: true, accessToken: tokenObject.accessToken, refreshToken: tokenObject.refreshToken, expiresIn: tokenObject.expiresIn });

   } else {
      res.status(401).json({ success: false, msg: "you entered the wrong password" });
   }
});

testRouter.get('/protected', verifyAccessToken, (req, res) => {
   console.log(req.user);
   res.end("authorized");
});


export default testRouter;