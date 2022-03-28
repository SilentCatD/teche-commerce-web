import express from "express";
import __dirname from "../../dirname.js";

const webPageRouter = new express.Router();

webPageRouter.get('/', async (req, res)=>{
    const params = {title: "eTech Home"};
    res.render('user/index',params);
});


webPageRouter.get('/shop', async (req, res)=>{
    // const result = ProductService.fetchAllProduct(9,-1,'createAt');
    // console.log(result);
    const params = {title: "eTech Shop"};
    res.render('user/shop-grid',params);
});

webPageRouter.get('/contact', async (req, res)=>{
    const params = {title: "eTech Contact"};
    res.render('user/contact',params);
});

webPageRouter.get('/details/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(id);
    const params = {title: "eTech Contact"};
});


export default webPageRouter;