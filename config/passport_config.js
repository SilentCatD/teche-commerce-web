import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import  {PUB_KEY} from '../utils/cert/key_pair.js'
import User from '../components/user/model.js';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
};



const strategy = new JwtStrategy(opts, async (payload, done)=>{
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

const passportInit = (passport)=>{
    passport.use(strategy);
}

export default passportInit;