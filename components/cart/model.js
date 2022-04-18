import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
    },
    amount: {
        type: Number,
        min: 1,
    }
}, {autoCreate: false});


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        min: 0,
    }

}, {autoCreate: false});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;