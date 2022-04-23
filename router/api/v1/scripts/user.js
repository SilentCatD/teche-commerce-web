import express from "express";
import UserController from "../../../../components/user/controller.js";
import multer from "multer";

const upload = multer();

const userRouter = express.Router();

userRouter.route('/')
    .get(UserController.fetchUserInfo)
    .post(upload.single('image'),UserController.editUserProfile);
    
export default userRouter;