import express from "express";
import authRouter from "./scripts/auth.js";
import brandRouter from "./scripts/brand.js";
import categoryRouter from "./scripts/category.js";
import productRouter from "./scripts/product.js";
import userRouter from "./scripts/user.js";
import CommentRouter from "./scripts/comment.js";
import cartRouter from "./scripts/cart.js";
import accountRouter from "./scripts/accounts.js";
import orderRouter from "./scripts/order.js";

const apiV1Router = express.Router();

apiV1Router.use('/brand', brandRouter);
apiV1Router.use('/category', categoryRouter);
apiV1Router.use('/product', productRouter);
apiV1Router.use('/comment', CommentRouter);
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/user', userRouter);
apiV1Router.use('/account', accountRouter);
apiV1Router.use('/cart', cartRouter);
apiV1Router.use('/order',orderRouter);
export default apiV1Router;
