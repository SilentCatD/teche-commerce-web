import express from "express";
import UserController from "../../../../components/user/controller.js";


const accountRouter = express.Router();

accountRouter.route('/')
    .get(UserController.fetchAllUser);

export default accountRouter;