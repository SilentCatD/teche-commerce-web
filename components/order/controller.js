import AuthorizationController from "../authorization/controller.js";
import CommonMiddleWares from "../common/middleware.js";

import OrderService from "./service.js";
import Cart from "../cart/model.js";
import Order from "./model.js";

import { param,query, body, validationResult } from "express-validator";

const deliveryValidator = [
  body("firstName")
    .exists()
    .bail()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("field can't be empty")
    .bail()
    .trim()
    .isByteLength({ min: 3, max: 20 })
    .withMessage("Name must in range [3, 20] Character"),
  body("lastName")
    .exists()
    .bail()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("field can't be empty")
    .bail()
    .trim()
    .isByteLength({ min: 3, max: 20 })
    .withMessage("Name must in range [3, 20] Character"),
  body("country")
    .exists()
    .bail()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("field can't be empty")
    .bail()
    .trim()
    .isByteLength({ min: 1, max: 30 })
    .withMessage("Name must in range [3, 30] Character"),
  body("address")
    .exists()
    .bail()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("field can't be empty")
    .bail()
    .trim()
    .isByteLength({ min: 1, max: 30 })
    .withMessage("Name must in range [3, 30] Character"),
  body("townCity")
    .exists()
    .bail()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("field can't be empty")
    .bail()
    .trim()
    .isByteLength({ min: 1, max: 30 })
    .withMessage("Name must in range [3, 30] Character"),
  body("postCode")
    .exists()
    .bail()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("field can't be empty")
    .bail()
    .trim()
    .isByteLength({ min: 1, max: 10 })
    .withMessage("Name must in range [1,10] Character"),
  body("phone")
    .exists()
    .bail()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("field can't be empty")
    .bail()
    .trim()
    .isByteLength({ min: 9, max: 12 })
    .withMessage("Name must in range [9,12] Character"),
  body("note")
    .if(body("note").exists())
    .isByteLength({ max: 256 })
    .withMessage("Shut the fuck up I'm not reading all that"),
];
const OrderController = {
  createOrder: [
    AuthorizationController.isValidAccount,
    deliveryValidator,
    async (req, res, next) => {
      const userId = req.user.id;
      const userCart = await Cart.findOne({ userId: userId }).populate(
        "items.productId"
      );
      if (userCart.items.length <= 0) {
        return res.status(400).json({ success: false, msg: "Empty Cart" });
      }
      for (let i = 0; i < userCart.items.length; i++) {
        let item = userCart.items[i];
        if (!item) {
          return res.status(400).json({
            success: false,
            msg: "Some Product Have Been Delete, try to refresh Page",
          });
        }
        if (item.amount > item.productId.inStock) {
          return res.status(400).json({
            success: false,
            msg: "Some Product amount in your cart be outdated",
          });
        }
      }
      req.cart = userCart.items;
      next();
    },
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }

        const userId = req.user.id;
        const userCartItems = req.cart;
        const {
          firstName,
          lastName,
          country,
          address,
          townCity,
          postCode,
          phone,
          note,
        } = req.body;
        const delivery = {
          firstName,
          lastName,
          country,
          address,
          townCity,
          postCode,
          phone,
          note,
        };
        await OrderService.createOrder(userId, userCartItems, delivery);
        res
          .status(200)
          .json({ success: true, msg: "Order have been created!" });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: "Some thing wrong happened" });
      }
    },
  ],
  fetchAllOrder: [
    AuthorizationController.isValidAccount,
    CommonMiddleWares.apiQueryParamsExtract,
    query("state")
      .if(query("state").exists())
      .notEmpty()
      .withMessage("field can't be empty")
      .custom((state) => {
        const options = ["new", "processing", "shipping", "completed"];
        if (!options.includes(state)) {
          throw new Error("invalid state");
        }
        return true;
      }),
    async (req, res) => {
      try {
        const { limit, page, sortParams, state } = req.query;
        const result = await OrderService.orderQueryAll(
          req.user,
          limit,
          page,
          sortParams,
          state
        );
        res.status(200).json({ success: true, data: result });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],
  changeOrderState: [
    AuthorizationController.isAdmin,
    param("orderId")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (orderId) => {
        try {
          const exist = await Order.exists({ _id: orderId });
          if (!exist) {
            throw new Error("Order not existed");
          }
          return true;
        } catch (e) {
          console.log(e);
          throw new Error("");
        }
      }),
    body("state")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (state) => {
        const options = ["new", "processing", "shipping", "completed"];
        if (!options.includes(state)) {
          throw new Error("invalid state");
        }
        return true;
      }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }
        const { orderId } = req.params;
        const { state } = req.body;
        await OrderService.changeOrderState(orderId, state);
        res
          .status(200)
          .json({ success: true, msg: "Order state have been changed!" });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: "Some thing wrong happened" });
      }
    },
  ],
  calculateRevenue: [
    AuthorizationController.isAdmin,
    body("startDate")
    .exists()
    .bail()
    .isDate()
    .withMessage("Field must be Date")
    .bail()
    .toDate(),
    body("endDate")
    .exists()
    .bail()
    .isDate()
    .withMessage("Field must be Date")
    .bail()
    .toDate(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }
        const { startDate, endDate } = req.body;
        const revenue = await OrderService.calculateRevenue(startDate, endDate);
        res.status(200).json({ success: true, data: revenue });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],
};

export default OrderController;
