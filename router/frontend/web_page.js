import express from "express";

const webPageRouter = new express.Router();

webPageRouter.get('/', async (req, res)=>{
    res.send("not have this yet");
});

export default webPageRouter;