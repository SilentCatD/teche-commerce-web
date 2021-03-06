import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { PUB_KEY } from "../utils/cert/key_pair.js";
import User from "../components/user/model.js";

// thrid party authenticate
import {googleAuthConfig } from "./third_party_auth.js";
import GoogleStrategy from "passport-google-oauth2";
import passport from "passport";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};



const jwtStrategy = new JwtStrategy(opts, async (payload, done)=>{
    try{
        const userId = payload.sub;
        const user =  await User.findById(userId);
        if(!user){
            return done(null, false, {success: false, msg: "can't locate user associated with token"});
        }
        if(!user.active){
            return done(null, false,  {success: false, msg: "user account not activated"});
        }
        const tokenInfo = {
            id: payload.id,
            type: payload.type,
        }
        return done(null, user, tokenInfo);
    }
    catch(err){  
        done(err, false, {success: false, msg: `something went wrong ${err}`});
    }
  });

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const googleStrategy = new GoogleStrategy(
    {
      clientID: googleAuthConfig.clientID,
      clientSecret: googleAuthConfig.clientSecret,
      callbackURL: googleAuthConfig.callbackURL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, cb) {
        const tokenInfo = {
          thirdPartyID: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        }
        return cb(null,tokenInfo);
    });


const passportInit = (passport) => {
  passport.use(jwtStrategy);
  passport.use(googleStrategy);
};

export default passportInit;
