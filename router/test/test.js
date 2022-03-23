import { Router } from "express";
import AuthorizationController from "../../components/authorization/controller.js";

const testRouter = Router();

testRouter.get('/protected', AuthorizationController.verifyAccessToken, AuthorizationController.isAdmin, async (req, res) => {
   console.log(req.body.user);
   res.end("authorized");
});

export default testRouter;

