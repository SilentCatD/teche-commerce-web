import accessTokenExpiraion from "../../config/access_token_expire.js";
import AuthoriztionService from "../authorization/service.js";
import User from "../user/model.js";
import UserService from "../user/service.js";
import AuthenticationService from "./service.js";

const AuthenticationController = {
    registerUser: async (req, res) => {

        const {email, password} = req.body;
        const newUser = await UserService.createUserWithRole(email, password, 'user');
        res.json({ success: true, user: newUser });
     },


     registerAdmin: async (req, res) => {
        const {email, password} = req.body;
        const newUser = await UserService.createUserWithRole(email, password, 'admin');
        res.json({ success: true, user: newUser });
     },
     
     
     login: async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
           return res.status(401).json({ success: false, msg: "could not find user" });
        }
        const isValid = AuthenticationService.validPassword(req.body.password, user.hash, user.salt);
        if (isValid) {
           const tokenObject = await AuthoriztionService.issueJWTToken(user._id, accessTokenExpiraion);
           res.status(200).json({ success: true, accessToken: tokenObject.accessToken, refreshToken: tokenObject.refreshToken, expiresIn: tokenObject.expiresIn });
     
        } else {
           res.status(401).json({ success: false, msg: "you entered the wrong password" });
        }
     },

     logout: async (req, res)=>{
         const refreshToken = req.body.token;
         await AuthoriztionService.revokeRefreshToken(refreshToken);
         res.send(200);
     }
};

export default AuthenticationController;