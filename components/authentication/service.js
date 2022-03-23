import { randomBytes, pbkdf2Sync } from 'crypto';

const AuthenticationService = {
    genPassword: (password) => {
        var salt = randomBytes(32).toString('hex');
        var genHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        return {
            salt: salt,
            hash: genHash
        };
    },

    validPassword: (password, hash, salt) => {
        var hashVerify = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === hashVerify;
    },
};

export default AuthenticationService
