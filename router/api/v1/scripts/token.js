import express from "express";
import AuthorizationController from "../../../../components/authorization/controller.js";

const tokenRouter = express.Router();
tokenRouter.route('/').get(AuthorizationController.verifyRefreshToken, AuthorizationController.getNewAccessToken);

export default tokenRouter;