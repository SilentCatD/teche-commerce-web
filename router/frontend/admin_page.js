import express from "express";
import __dirname from "../../dirname.js";

const adminPageRouter = new express.Router();

adminPageRouter.get('/', async (req, res)=>{
    let options = {root: __dirname + '/public/admin', index: false};
    res.sendFile('signin.html', options);
});

export default adminPageRouter;