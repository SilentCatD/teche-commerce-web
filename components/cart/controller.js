import AuthorizationController from "../authorization/controller.js";
import CartService from "./service.js";
import { body, validationResult } from "express-validator";
import Product from "../product/model.js";

const validateBody = [
    body("product")
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
        const { product } = req.body;
        const userId = req.user.id;
        await CartService.addProduct(userId, product);
      } catch (e) {
        return res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e.message}` });
      }
    },
  ],
  removeItem: [
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
        const { product } = req.body;
        const userId = req.user.id;
        await CartService.removeProduct(userId, product);
      } catch (e) {
        return res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e.message}` });
      }
    },
  ],
};

export default CartController;
