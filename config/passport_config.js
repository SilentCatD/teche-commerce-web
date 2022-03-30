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
            return done(null, false);
        }
        if(!user.active){
            return done(null, false);
        }
        const tokenInfo = {
            id: payload.id,
            type: payload.type,
        }
        return done(null, user, tokenInfo);
    }
    catch(err){  
        done(err, false);
    }
});

const passportInit = (passport)=>{
    passport.use(strategy);
}

export default passportInit;