import Cart from "./model.js";
import Product from '../product/model.js';

const CartService = {
  createCart: async (userId) => {
    const cart = await Cart.create({ userId: userId });
    return cart;
  },
  getCart: async (userId)=>{
    let cart = await Cart.findOne({ userId: userId }).populate('items.productId');
    if(!cart){
        cart = await CartService.createCart(userId);
    }
    return cart;
  },
  addProduct: async (userId, productId,amount) => {
    const session = await Cart.startSession();
    session.startTransaction();
    try {
      let cart = await Cart.findOne({ userId: userId }).session(session);
      if(!cart){
        cart = await CartService.createCart(userId);
      }
      let existed = false;
      cart.items =  await Promise.all(cart.items.map(async (item) => {
        if (item.productId == productId) {
          existed = true;
          const product = await Product.findById(productId);
          if(product.inStock - ( item.amount+ amount) >= 0){
            item.amount+=amount;
          }
          else{
            throw new Error('product is out of stock');
          }
        }
        return item;
      }));
      if (!existed) {
        const product = await Product.findById(productId);
        if(product.inStock - amount >= 0){
            cart.items.push({
              productId: productId,
                amount: amount,
              });
        }else{
            throw new Error('product is out of stock');
        }
      }
      await cart.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
  removeItem: async (userId, productId) => {
    const session = await Cart.startSession();
    session.startTransaction();
    try {
      let cart = await Cart.findOne({ userId: userId }).session(session);
      if(!cart){
          cart = await CartService.createCart(userId);
      }
      const cartItem = cart.items.find(element => element.productId == productId);
      // await cart.items.pull({productId:productId}); 
      await cart.items.pull(cartItem); 
      await cart.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
};

export default CartService;