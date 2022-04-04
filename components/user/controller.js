import AuthorizationController from "../authorization/controller.js";
import User from "./model.js";
import { param, validationResult, body } from "express-validator";

const UserController = {
  fetchUserInfo: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      res.status(200).json({success: true, data: req.user});
    },
  ],
};

export default UserController;
