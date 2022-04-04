import express from "express";
import UserController from "../../../../components/user/controller.js";


const userRouter = express.Router();

userRouter.route('/')
    .get(UserController.fetchUserInfo)
    .post(UserController.editUserProfile);
    
export default userRouter;