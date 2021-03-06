import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
    },
    amount: {
        type: Number,
        min: 1,
    },
    total: {
        type: Number,
        min: 0,
    }
}, {autoCreate: false});


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    items: [cartItemSchema],
}, {autoCreate: false});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;