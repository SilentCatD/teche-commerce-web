import express from "express";
import CartController from "../../../../components/cart/controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(CartController.getCart)
  .post(CartController.addItem)
  .delete(CartController.removeItem);

export default cartRouter;
