import Cart from "../cart/model.js";
import Order from "./model.js";
import ProductService from "../product/service.js";
import CartService from "../cart/service.js";

const OrderService = {
    createOrder: async (userId,CartItems,delivery) => {
        const session = await Order.startSession();
        session.startTransaction();
        try {
            const orderDetails = await Promise.all(CartItems.map(async (item) => {
                   await ProductService.editProductStock(item.productId._id,-item.amount);
                   return {
                      productName:  item.productId.name,
                      productPrice: item.productId.price,
                      amount: item.amount,
                      total: item.amount*item.productId.price,
                   }
                }));
        
        await Order.create({userId,orderDetails,delivery});
        await CartService.clearCart(userId);
        await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            await session.endSession();
        }
    },
    changeOrderState: async (orderId, newState) => {
        const session = await Order.startSession();
        session.startTransaction();
        try {
            const order = Order.findById(orderId);
            order.state = newState;
            await order.save();
            await session.commitTransaction();
        } catch(e) {
            await session.abortTransaction();
            throw e;
        } finally {
            await session.endSession();
        }
    }
  };

  export default OrderService;