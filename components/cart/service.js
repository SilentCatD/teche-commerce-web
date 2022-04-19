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
    console.log(cart);
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
          console.log(item);
          return item;
        }
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
      console.log(cart);
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
      let cart = await Cart.findOne({ userId: userId }).populate('items.productId').session(session);
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