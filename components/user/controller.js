import AuthorizationController from "../authorization/controller.js";
import UserService from "./service.js";
import CommentService from "../common/middleware.js";
import AuthenticationService from "../authentication/service.js";
import { body, param, validationResult } from "express-validator";


const UserController = {
  fetchUserInfo: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      res.status(200).json({success: true, data: req.user});
    },
  ],
  editUserProfile: [
    AuthorizationController.isValidAccount,
    CommentService.accountEditRequireMent,
    async (req,res) => {
      try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }

      const {name,oldPassword,password} = req.body;
      const userID = req.user.id;

      if(password) {
        const isValidConfirmPassword = AuthenticationService.validPassword(
          oldPassword,
          req.user.hash,
          req.user.salt
        );
        if(!isValidConfirmPassword)  {
          return res
          .status(400)
          .json({ success: false, msg: "You enter wrong password"});
        } 
        await UserService.editUserProfile(userID,password,null);
      } else {
        await UserService.editUserProfile(userID,null,name);
      }
      return res.status(200).end("Edit Successful");
      } catch (err) {
        console.log(err);
        res.status(500).end(err.message);
      }
    }
  ]
};

export default UserController;
