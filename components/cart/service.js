import Cart from "./model.js";
import Product from '../product/model.js';

const CartService = {
  createCart: async (userId) => {
    const cart = await Cart.create({ userId: userId });
    return cart;
  },
  getCart: async (userId)=>{
    let cart = await Cart.findOne({ userId: userId }).populate('items.product');
    if(!cart){
        cart = await CartService.createCart(userId);
    }
    return cart;
  },
  addProduct: async (userId, productId) => {
    const session = await Cart.startSession();
    session.startTransaction();
    try {
      let cart = await Cart.findOne({ userId: userId }).populate('items.product').session(session);
      if(!cart){
        cart = await CartService.createCart(userId);
      }
      const items = cart.items;
      let existed = false;
      items.map((item) => {
        if (item.product.id == productId) {
          existed == true;
          if(item.product.inStock > 0){
            item.amount++;
          }
          else{
            throw new Error('product is out of stock');
          }
        }
      });
      if (!existed) {
        const product = await Product.findById(productId);
        if(product.inStock > 0){
            cart.items.push({
                productId: productId,
                amount: 1,
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
  removeProduct: async (userId, productId) => {
    const session = await Cart.startSession();
    session.startTransaction();
    try {
      let cart = await Cart.findOne({ userId: userId }).populate('items.product').session(session);
      if(!cart){
          cart = await CartService.createCart(userId);
      }
      const products = cart.items;
      let existed = false;
      await Promise.all(products.map(async (product) => {
        if (product.product == productId) {
          existed == true;
          
          if(product.amount >1){
            product.amount--;
          }else{
            await cart.items.id(product._id).remove();
          }
        }
      }));
      if (!existed) {
        throw new Error('product not existed in cart');
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
};

export default CartService;