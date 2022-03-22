import express from "express";
import __dirname from "../../dirname.js";

const webPageRouter = new express.Router();

webPageRouter.get('/', async (req, res)=>{
    let options = {root: __dirname + '/public/user', index: false};
    res.sendFile("login.html",options);
});

webPageRouter.get('/index', async (req, res)=>{
    let options = {root: __dirname + '/public/user', index: false};
    res.sendFile("index.html",options);
});


export default webPageRouter;