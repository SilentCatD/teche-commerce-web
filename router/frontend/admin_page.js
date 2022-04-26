import express from "express";
import AdminPageController from "../../components/admin_pages/controller.js";
import __dirname from "../../dirname.js";

const adminPageRouter = new express.Router();
adminPageRouter.get('/', AdminPageController.login);
adminPageRouter.get('/home', AdminPageController.home);
adminPageRouter.get('/products',AdminPageController.products);
adminPageRouter.get('/brands', AdminPageController.brands);
adminPageRouter.get('/categories',AdminPageController.categories);
adminPageRouter.get('/accounts',AdminPageController.accounts);
adminPageRouter.get('/edit-product/:id', AdminPageController.editProduct);
adminPageRouter.get('/profile', AdminPageController.profile);
adminPageRouter.get('/orders', AdminPageController.orders);
adminPageRouter.get('/accounts/:id', AdminPageController.details)
export default adminPageRouter;