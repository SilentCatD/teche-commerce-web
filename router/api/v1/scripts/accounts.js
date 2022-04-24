import express from "express";
import UserController from "../../../../components/user/controller.js";


const accountRouter = express.Router();

accountRouter.route('/')
    .get(UserController.fetchAllUser);

accountRouter.route('/toggle_active/:id').patch(UserController.toggleAccountActive);

export default accountRouter;