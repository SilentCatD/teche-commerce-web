import AuthenticationService from "../authentication/service.js";
import User from "./model.js";

const UserService = {

  resetUserPassword: async(userId, password)=>{
    const saltHash = AuthenticationService.genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const user = await User.findById(userId);
    user.hash = hash;
    user.salt = salt;
    await user.save();
  },

  createUserWithRole: async (email, password, role) => {
    const saltHash = AuthenticationService.genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new User({
      email: email,
      hash: hash,
      salt: salt,
      role: role,
      ...(role == "admin" && { active: true }),
    });
    await newUser.save();
    return newUser;
  },

  activeUserAccount: async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("user not exist");
    }
    user.active = true;
    await user.save();
  },

  suspendUserAccount: async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("user not exist");
    }
    user.active = false;
    await user.save();
  },
};

export default UserService;
