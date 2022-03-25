import express from "express";
import __dirname from "../../dirname.js";

const webPageRouter = new express.Router();

webPageRouter.get('/', async (req, res)=>{
    let options = {root: __dirname + '/public/user', index: false};
    res.sendFile("login.html",options);
});

webPageRouter.get('/index', async (req, res)=>{
    const params = {title: "eTech Home"};
    res.render('user/index',params);
});


webPageRouter.get('/shop', async (req, res)=>{
    const params = {title: "eTech Shop"};
    res.render('user/shop-grid',params);
});

webPageRouter.get('/contact', async (req, res)=>{
    const params = {title: "eTech Contact"};
    res.render('user/contact',params);
});


export default webPageRouter;