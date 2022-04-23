import AuthorizationController from "../authorization/controller.js";
import UserService from "./service.js";
import AuthenticationService from "../authentication/service.js";
import {validationResult, body } from "express-validator";

const UserController = {
  fetchUserInfo: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      const user = {};
      user.name = req.user.name;
      user.email = req.user.email;
      user.id = req.user.id;
      user.role = req.user.role;
      user.usePassword = req.user.hash ? true: false;
      user.avatar = req.user.avatar.firebaseUrl;
      res.status(200).json({ success: true, data: user });
    },
  ],
  editUserProfile: [
    AuthorizationController.isValidAccount,
    body("name")
      .if(body("name").exists())
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isByteLength({ min: 3, max: 20 })
      .withMessage("Name must in range [3, 20] Character"),
    body("newPassword")
      .if(body("newPassword").exists())
      .trim()
      .custom(async (newPassword, { req, loc, path }) => {
        if (req.user.salt) {
          const oldPasswordInput = req.body.oldPassword;
          if (!oldPasswordInput) {
            throw new Error("old password not provided");
          }
          if (
            !AuthenticationService.validPassword(
              oldPasswordInput,
              req.user.hash,
              req.user.salt
            )
          ) {
            throw new Error("old password does not match");
          }
        } else {
          return true;
        }
      })
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .isStrongPassword({ minSymbols: 0 })
      .withMessage("password not strong enough"),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, msg: errors.array()[0].msg });
      }
      try {
        let imageFile = req.file;
        if (imageFile) {
          const type = imageFile.mimetype;
          if (!["image/png", "image/jpeg"].includes(type)) {
            return res.status(400).json({
              success: false,
              msg: "image must be of type png or jpeg",
            });
          }
        }
        const { name, newPassword } = req.body;
        const userID = req.user.id;
        await UserService.editUserProfile(userID, newPassword, name, imageFile);
        return res
          .status(200)
          .json({ success: true, msg: "edit user success" });
      } catch (err) {
        res.status(500).end({ success: false, msg: err.message });
      }
    },
  ],
};

export default UserController;
