import express from "express";
import AdminPageController from "../../components/admin_pages/controller.js";
import __dirname from "../../dirname.js";

const adminPageRouter = new express.Router();
adminPageRouter.get('/', AdminPageController.login);
adminPageRouter.get('/home', AdminPageController.home);
adminPageRouter.get('/products',AdminPageController.products);
adminPageRouter.get('/brands', AdminPageController.brands);
adminPageRouter.get('/categories',AdminPageController.categories);
adminPageRouter.get('/edit-product/:id', AdminPageController.editProduct);

export default adminPageRouter;