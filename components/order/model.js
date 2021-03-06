import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    productPrice:{
        type: Number,
        min: 1,
    },
    amount: {
        type: Number,
        min: 1,
    },
    total: {
        type: Number,
    }
}, {autoCreate: false});

const DeliverySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    townCity: {
        type: String,
        required: true,
    },
    postCode:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    note:{
        type: String,
    },
})

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    delivery: {
        type: DeliverySchema,
    },
    orderDetails: [orderDetailSchema],
    totalPrice: {
        default:0,
        type:Number,
    },
    state: {
        type: String,
        required: true,
        default: "new" // new -> processing -> shipped -> completed
    }
}, {autoCreate: false,timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

export default Order;