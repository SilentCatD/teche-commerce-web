import express from "express";
import OrderController from "../../../../components/order/controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(OrderController.fetchAllOrder)
  .post(OrderController.createOrder); // create order,
  // .put(OrderController.changeState); // update order,



export default orderRouter;
