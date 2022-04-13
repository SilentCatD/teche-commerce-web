import AuthenticationService from "../authentication/service.js";
import User from "./model.js";
import mongoose from "mongoose";

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

  createUserWithRole: async (email,name, password, role) => {
    const saltHash = AuthenticationService.genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new User({
      email: email,
      name: name,
      hash: hash,
      salt: salt,
      role: role,
      ...(role == "admin" && { active: true }),
    });
    await newUser.save();
    return newUser;
  },

  createThirdPartyUser: async (name, email) => {
    const newUser = await new User({
      name: name,
      email: email,
      active: true,
      role: "user",
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
  editUserProfile: async(id,password,name) => {
    const session = await User.startSession();
    session.startTransaction();
    try {
      const user = await User.findById(mongoose.Types.ObjectId(id)).session(session);
      if(!user) {
        throw new Error(`User ${id} is not existed`);
      }
      if(name) {
        user.name = name;
      }
      if(password) {
        const saltHash = AuthenticationService.genPassword(password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        user.hash = hash;
        user.salt = salt;
      }
      await user.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally{
      await session.endSession();
    }
  }
};

export default UserService;
