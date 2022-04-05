import AuthorizationController from "../authorization/controller.js";
import UserService from "./service.js";
import CommentService from "../common/middleware.js";
import AuthenticationService from "../authentication/service.js";


const UserController = {
  fetchUserInfo: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      res.status(200).json({success: true, data: req.user});
    },
  ],
  editUserProfile: [
    AuthorizationController.isValidAccount,
    CommentService.accountRegisterRequirement,
    async (req,res) => {
      try {
      const {name,verifyPassword,password} = req.body;
      const userID = req.user.id;
      if(password) {
        const isValidConfirmPassword = AuthenticationService.validPassword(
          verifyPassword,
          req.user.hash,
          req.user.salt
        );
        if(isValidConfirmPassword)  {
          await UserService.editUserProfile(userID,password,null);
        } else {
          return res.status(200).end("You Enter Wrong Password");
        }
      } else {
        await UserService.editUserProfile(userID,null,name);
      }
      return res.status(200).end("Edit Successful");
      } catch (err) {
        res.status(404).end(err.message);
      }
    }
  ]
};

export default UserController;
