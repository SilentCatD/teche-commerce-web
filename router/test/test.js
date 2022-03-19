
import { Router } from "express";
const testRouter = Router();

testRouter.use('/', async (req, res)=>{
   res.render('test');
});

export default testRouter;