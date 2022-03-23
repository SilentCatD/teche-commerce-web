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

adminPageRouter.get('/products', async(req, res)=>{
    const param = {title: "Products", active: ['store','products']};
    res.render('admin/products', param);
});


adminPageRouter.get('/brands', async(req, res)=>{
    const param = {title: "Brands", active: ['store','brands']};
    res.render('admin/brands', param);
});


adminPageRouter.get('/categories', async(req, res)=>{
    const param = {title: "Categories", active: ['store','categories']};
    res.render('admin/categories', param);
});


export default adminPageRouter;