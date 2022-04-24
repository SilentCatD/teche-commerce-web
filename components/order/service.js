import Cart from "../cart/model.js";
import Order from "./model.js";
import ProductService from "../product/service.js";
import CartService from "../cart/service.js";
import CommomDatabaseServies from "../common/services.js";

const OrderService = {
    returnData: (order) => {
        if(!order) return null;
        return {
            id: order.id,
            items: order.orderDetails,
            state: order.state,
            delivery: order.delivery,
            createdAt: order.createdAt.toLocaleString('en-US'),
            updatedAt: order.updatedAt.toLocaleString('en-US'),
        }
    },
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
    },
    orderQueryAll: async (userId, limit, page, sortParams, state) =>  {
        let queryParams = {
            ...(state && {state: state}),
            ... ({userId:userId}),
          };
        const totalCount = await Order.countDocuments(queryParams);
        const orders = await Order.find(queryParams)
          .skip(limit*page - limit)
          .limit(limit)
          .sort(sortParams);

          const items = orders.map((order) => {
            return OrderService.returnData(order);
          });
        return CommomDatabaseServies.queryAllFormat(totalCount, limit, page, items);

    }
  };

  export default OrderService;