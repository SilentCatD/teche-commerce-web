import express from "express";
import __dirname from "../../dirname.js";

const adminPageRouter = new express.Router();

adminPageRouter.get('/', async (req, res)=>{
    const param = {title: "Dashboard", active: ['dashboard']};
    res.render('admin/index', param);
});

adminPageRouter.get('/login', async(req, res)=>{
    const param = {title: "Login"};
    res.render('admin/login', param);
});

export default adminPageRouter;