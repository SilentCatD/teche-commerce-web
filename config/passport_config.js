import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { PUB_KEY } from "../utils/cert/key_pair.js";
import User from "../components/user/model.js";

// thrid party authenticate
import { facebookAuthConfig, googleAuthConfig } from "./third_party_auth.js";
import FacebookStrategy from "passport-facebook";
import GoogleStrategy from "passport-google-oauth2";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    const userId = payload.sub;
    const user = await User.findById(userId);
    if (!user) {
      return done(null, false);
    }
    if (!user.active) {
      return done(null, false);
    }
    const tokenInfo = {
      id: payload.id,
      type: payload.type,
    };
    return done(null, user, tokenInfo);
  } catch (err) {
    done(err, false);
  }
});

const googleStrategy = new GoogleStrategy(
    {
      clientID: googleAuthConfig.clientID,
      clientSecret: googleAuthConfig.clientSecret,
      callbackURL: googleAuthConfig.callbackURL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, cb) {
        const user = await User.findOne({ thirdPartyID: profile.id });
        // Find User
        console.log(user);
        if (user) {
          return cb(null, user);
        } else {
          const tokenInfo = {
            thirdPartyID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          };
          console.log(tokenInfo);
          return cb(null, user, tokenInfo);
        }
      });


const facebookStrategy = new FacebookStrategy(
  {
    clientID: facebookAuthConfig.clientID,
    clientSecret: facebookAuthConfig.clientSecret,
    callbackURL: facebookAuthConfig.callbackURL,
    profileFields: ["id", "displayName", "email"],
  },
  async function (accessToken, refreshToken, profile, cb) {
    const user = await User.findOne({ thirdPartyID: profile.id });
    // Find User
    console.log(user);
    if (user) {
      return cb(null, user);
    } else {
      const tokenInfo = {
        thirdPartyID: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      return cb(null, user, tokenInfo);
    }
  }
);

const passportInit = (passport) => {
  passport.use(strategy);
  passport.use(facebookStrategy);
  passport.use(googleStrategy);
};

export default passportInit;
