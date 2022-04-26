import express from "express";
import OrderController from "../../../../components/order/controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(OrderController.fetchAllOrderOfAUser)
  .post(OrderController.createOrder) // create order,
orderRouter.get('/all', OrderController.fetchAllOrder);

orderRouter.route("/:orderId")
  .put(OrderController.changeOrderState); // update order,

orderRouter.route("/statis/day")
  .put(OrderController.calculateRevenue);

export default orderRouter;
