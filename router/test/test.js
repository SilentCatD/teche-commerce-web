import { Router } from "express";
import { randomBytes, pbkdf2Sync } from 'crypto';
import User from "../../components/user/model.js";
import jsonwebtoken from "jsonwebtoken";
import __dirname from "../../dirname.js";
import { readFileSync } from 'fs';
import passport from 'passport';
const PRIV_KEY = readFileSync(__dirname + '/id_rsa_priv.pem', 'utf-8');


const testRouter = Router();

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


function issueJWT(user) {
   const _id = user._id;

   const expiresIn = '30s';

   const payload = {
      sub: _id,
      iat:  Math.floor(Date.now() / 1000),
   };

   const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

   return {
      token: "Bearer " + signedToken,
      expires: expiresIn
   }
}

async function isAdmin(req, res, next){
   if(req.user.role != 'admin'){
      res.status(401).end('unauthorized');
   }else{
      next();
   }
}

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
   const jwt = issueJWT(newUser);
   res.json({ success: true, user: newUser, token: jwt.token, expireIn: jwt.expires });
});


testRouter.post('/register_admin', async (req, res) => {
   const saltHash = genPassword(req.body.password);

   const salt = saltHash.salt;
   const hash = saltHash.hash;

   const newUser = new User({
      email: req.body.email,
      hash: hash,
      salt: salt,
      role: 'admin',
   });
   await newUser.save();
   const jwt = issueJWT(newUser);
   res.json({ success: true, user: newUser, token: jwt.token, expireIn: jwt.expires });
});


testRouter.get('/login', async (req, res) => {
   const user = await User.findOne({ email: req.body.email });
   if(!user){
      return res.status(401).json({success: false, msg: "could not find user"});
   }
   const isValid = validPassword(req.body.password, user.hash, user.salt);
   if (isValid) {
      const tokenObject = issueJWT(user);
      res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });

  } else {
      res.status(401).json({ success: false, msg: "you entered the wrong password" });
  }
});

// login required
testRouter.get('/protected_admin', passport.authenticate('jwt', {session: false}), isAdmin, async (req, res)=>{
   res.status(200).json({success: true, msg: "you are authorized"});
});


// admin requried
testRouter.get('/protected', passport.authenticate('jwt', {session: false}), async (req, res)=>{
   res.status(200).json({success: true, msg: "you are authorized"});
});


export default testRouter;