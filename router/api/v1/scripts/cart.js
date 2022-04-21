import express from "express";
import CartController from "../../../../components/cart/controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(CartController.getCart)
  .post(CartController.addItem)
  .put(CartController.updateItem)
  .delete(CartController.removeItem);

export default cartRouter;
