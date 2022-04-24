import AuthenticationService from "../authentication/service.js";
import User from "./model.js";
import mongoose from "mongoose";
import ImageService from "../image/service.js";
import CommomDatabaseServies from "../common/services.js";

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

  returnData: (user)=>{
    const result = {};
    result.name = user.name;
    result.email = user.email;
    result.id = user.id;
    result.role = user.role;
    result.status = user.active ? 'active' : 'inactive';
    result.usePassword = user.hash ? true: false;
    if(user.avatar){
      result.avatar = user.avatar.firebaseUrl;
    }else{
      result.avatar = null;
    }
    result.createdAt = user.createdAt;
    return result;
  },

  fetchUser: async (id)=>{
    const user = await User.findById(id);
    return UserService.returnData(user);
  },

  fetchAllUser: async (limit, page, role, active, sortParams, query) => {
    let queryParams = {
      ...(typeof active != 'undefined' && {active: active}),
      ...(role && {role: role}),
      ...(query  && {$text: {$search: query}}),
    };
    const totalCount = await User.countDocuments(queryParams);
    const users = await User.find(queryParams)
      .skip(limit * page - limit)
      .limit(limit)
      .sort(sortParams);
    const items =  users.map((user) => {
      return UserService.returnData(user);
    });
    return CommomDatabaseServies.queryAllFormat(totalCount, limit, page, items);
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
  editUserProfile: async(id,password,name, imageFile) => {
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
      if(imageFile){
        const imageObj = await ImageService.createImage(imageFile);
        user.avatar = imageObj;
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
