import AuthenticationService from "../authentication/service.js";
import User from "./model.js";

const UserService = {
    createUserWithRole: async (email, password, role)=>{
        const saltHash = AuthenticationService.genPassword(password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;
        const newUser = new User({
           email: email,
           hash: hash,
           salt: salt,
           role: role,
        });
        await newUser.save();
        return newUser;
    },
};

export default UserService;