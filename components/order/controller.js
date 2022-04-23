import AuthorizationController from "../authorization/controller.js";
import OrderService from "./service.js";
import { body, validationResult } from "express-validator";
import Cart from "../cart/model.js";

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

]
const OrderController = {
    createOrder: [
        AuthorizationController.isValidAccount,
        deliveryValidator,
        async (req, res, next) => {
            const userId = req.user.id;
            const userCart = await Cart.findOne({ userId: userId }).populate('items.productId');
            if (userCart.items.length <= 0) {
                return res.status(400).json({ success: false, msg: "Empty Cart" });
            }
            for(let i =0 ; i < userCart.items.length;i++) {
                let item = userCart.items[i];
                // status code for handle checkout 
                if (!item) {
                    return res.status(401).json({ success: false, msg: "Some Product Have Been Delete, try to refresh Page" });
                }
                if (item.amount > item.productId.inStock) {
                    return res.status(402).json({ success: false, msg: "Some Product amount in your cart be outdated" });
                }
            }
            req.cart = userCart.items;
            next();
        },
        async (req,res) => {
            const userId = req.user.id;
            const userCartItems = req.cart;
            const {firstName,lastName,country,address,townCity,postCode,phone,note} = req.body;
            const delivery = {firstName,lastName,country,address,townCity,postCode,phone,note};
            try {
                await OrderService.createOrder(userId,userCartItems,delivery);
                res.status(200).json({success:true,msg:"Order have been created!"});
            } catch (e) {
                console.log(e);
                res.status(500).json({success:false,msg:"Some thing wrong happened"});
            }
        }
    ],
    // changeOrderState: [
    //     async
    // ]

};

export default OrderController;
