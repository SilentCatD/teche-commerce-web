import express from "express";
import OrderController from "../../../../components/order/controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(OrderController.fetchAllOrder)
  .post(OrderController.createOrder) // create order,

orderRouter.route("/:orderId")
  .put(OrderController.changeOrderState); // update order,

orderRouter.route("/statis")
  .post(OrderController.calculateRevenue);

export default orderRouter;
