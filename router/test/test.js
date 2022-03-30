import { Router } from "express";
import AuthorizationController from "../../components/authorization/controller.js";
import passport from 'passport';


const testRouter = Router();

testRouter.get('/protected', AuthorizationController.isAdmin, async (req, res) => {
   console.log(req.user);
   console.log(req.authInfo);
   res.end("authorized");
});

export default testRouter;

