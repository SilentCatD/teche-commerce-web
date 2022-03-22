import fs from 'fs';
import __dirname from '../dirname.js';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../components/user/model.js';
import mongoose from 'mongoose';
const PUB_KEY = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf-8');


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new Strategy(options, async (payload, done) => {
    try {
        console.log(payload);
        const user = await User.findById(mongoose.Types.ObjectId(payload.sub));
        if (user) {
            done(null, user);
        }else{
            done(null, false);
        }
    } catch (err) {
        done(err, null);
    }
});

function passportConfig(passport) {
    passport.use(strategy);
}

export default passportConfig;