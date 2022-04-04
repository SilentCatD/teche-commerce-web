import AuthorizationController from "../authorization/controller.js";
import User from "./model.js";
import UserService from "./service.js";
import  validator from "express-validator";

const UserController = {
  fetchUserInfo: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      res.status(200).json({success: true, data: req.user});
    },
  ],
  editUserProfile: [
    AuthorizationController.isValidAccount,
    async (req,res) => {
      try {
      const {name} = req.body;
      const userID = req.user.id;
      await UserService.editUserProfile(userID,name);
      return res.status(200).end("Edit Successful");
      } catch (err) {
        console.error(err);
        res.status(404).end(err.message);
      }
    }
  ]
};

export default UserController;
