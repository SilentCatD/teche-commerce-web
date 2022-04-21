import AuthorizationController from "../authorization/controller.js";
import CartService from "./service.js";
import { body, validationResult } from "express-validator";
import Product from "../product/model.js";

const validateBody = [
    body("productId")
      .exists()
      .withMessage("must provide product id")
      .custom(async (productId) => {
        try {
          const product = await Product.findById(productId);
          if (!product) {
            throw new Error();
          }
          return true;
        } catch (e) {
          throw new Error("product not exist");
        }
      }),
      body("amount")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isInt({min:-1})
      .withMessage("field must be integer in range [-1 ...]")
      .toInt(),
]

const CartController = {
  getCart: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      const userId = req.user.id;
      try {
        const cartData = await CartService.getCart(userId);
        return res.status(200).json({ success: true, data: cartData });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: e.message });
      }
    },
  ],
  addItem: [
    AuthorizationController.isValidAccount,
    validateBody,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, msg: errors.array()[0].msg });
      }
      try {
        const { productId,amount } = req.body;
        const userId = req.user.id;
        console.log(productId);
        await CartService.addItem(userId, productId,amount);
        return res
        .status(200)
        .json({ success: true, msg: "Add success"});
      } catch (e) {
        console.log(e);
        return res
          .status(500)
          .json({ success: false, msg: `${e.message}` });
      }
    },
  ],
  updateItem: [
    AuthorizationController.isValidAccount,
    validateBody,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, msg: errors.array()[0].msg });
      }
      try {
        const { productId,amount } = req.body;
        const userId = req.user.id;
        console.log(productId);
        await CartService.updateItem(userId, productId,amount);
        return res
        .status(200)
        .json({ success: true, msg: "Add success"});
      } catch (e) {
        console.log(e);
        return res
          .status(500)
          .json({ success: false, msg: `${e.message}` });
      }
    },
  ],
  removeItem: [
    AuthorizationController.isValidAccount,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, msg: errors.array()[0].msg });
      }
      try {
        const { productId } = req.body;
        const userId = req.user.id;
        await CartService.removeItem(userId, productId);
        return res
        .status(200)
        .json({ success: true, msg: "remove item success"});
      } catch (e) {
        return res
          .status(500)
          .json({ success: false, msg: `${e.message}` });
      }
    },
  ],
};

export default CartController;
