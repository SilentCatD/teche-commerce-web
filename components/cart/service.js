import Cart from "./model.js";
import Product from '../product/model.js';


async function validCart(userId) {
  let cart = null;
  const session = await Cart.startSession();
  session.startTransaction();
  try {
  cart = await Cart.findOne({ userId: userId }).populate('items.productId');
  for(let i = 0 ; i < cart.items.length;i++) {
    let item = cart.items[i];
    if(!item.productId || item.productId.inStock <= 0) await cart.items.pull(item);  
  };
  await cart.save();
  await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
  } 
  finally {
    await session.endSession();
    return cart;
  }
}

const CartService = {
  createCart: async (userId) => {
    const cart = await Cart.create({ userId: userId });
    return cart;
  },
  getCart: async (userId)=>{
    let cart = await validCart(userId)
    if(!cart){
        cart = await CartService.createCart(userId);
    }
    return cart;
  },

  getBasicCartInfo: async (userId)=>{
    let cart = await Cart.findOne({ userId: userId });
    if(!cart){
        cart = await CartService.createCart(userId);
    }
    return {
      amount: cart.items.length,
      total: cart.items.reduce((partialSum,a)=>partialSum+a.total,0),
    };
  },
  // using for add product, add same product again, add or remove product by 1 
  addItem: async (userId, productId,amount) => {
    const session = await Cart.startSession();
    session.startTransaction();
    try {
      let cart = await Cart.findOne({ userId: userId }).session(session);
      if(!cart){
        cart = await CartService.createCart(userId);
      }
      let existed = false;
      const product = await Product.findById(productId);
      if(!product)  throw new Error("Congratulation! Product just have been deleted");

      cart.items =  await Promise.all(cart.items.map(async (item) => {
        if (item.productId == productId) {
          existed = true;
          if(item.amount <=1 && amount < 0) {
            throw new Error("Congratulation! You are fking wizard (by messing frontend js or database)");
          }
          if(product.inStock - ( item.amount+ amount) >= 0){
            item.amount+=amount;
            item.total = product.price*item.amount;
          }
          else{
            throw new Error(`product is out of stock (remain ${product.inStock})`);
          }
        }
        return item;
      }));
      if (!existed) {
        if(amount <=0) {
          throw new Error("Congratulation! You are fking wizard (by messing frontend js or database)");
        }
        if(product.inStock  >= amount){
            cart.items.push({
              productId: productId,
              amount: amount,
              total: product.price*amount,
              });
        }else{
          throw new Error(`product is out of stock (remain ${product.inStock})`);
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
  clearCart: async (userId) => {
    const session = await Cart.startSession();
    session.startTransaction();
    try {
      let cart = await Cart.findOne({ userId: userId }).session(session);
      if(!cart){
          cart = await CartService.createCart(userId);
      }
      cart.items=[];      
      await cart.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },

  // If you want check immediately in frontend
  updateItem: async (userId, productId,amount) => {
    const session = await Cart.startSession();
    session.startTransaction();
    try {
      if(amount <= 0) {
        throw new Error("Congratulation! You are fking wizard (by messing frontend js or database)");
      }
      let cart = await Cart.findOne({ userId: userId }).session(session);
      if(!cart){
        cart = await CartService.createCart(userId);
      }
      let existed = false;
      const product = await Product.findById(productId);
      cart.items =  await Promise.all(cart.items.map(async (item) => {
        if (item.productId == productId) {
          existed = true;
          if(product.inStock >= amount ){
            item.amount=amount;
            item.total = product.price*item.amount;
          }
          else{
            throw new Error(`product is out of stock (remain ${product.inStock})`);
          }
        }
        return item;
      }));
      // this never happen
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