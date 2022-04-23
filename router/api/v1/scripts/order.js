import express from "express";
import OrderController from "../../../../components/order/controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
//   .get(OrderController.getOrder) // query order,
  .post(OrderController.createOrder); // create order,


export default orderRouter;
