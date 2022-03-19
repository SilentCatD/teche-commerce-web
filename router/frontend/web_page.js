import express from "express";

const webPageRouter = new express.Router();

webPageRouter.get('/', async (req, res)=>{
    res.send("../../public/user/index.html");
});

export default webPageRouter;