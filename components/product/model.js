import mongoose from "mongoose";
import { commentSchema } from "../comment/model.js";
import { imageSchema } from "../image/model.js";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    rateAverage: { // vdL 4.3, 2.2
        type: Number,
        min: 0,
        default: 0,
    },
    rates: [Number], // mảng 5 phần tử tương ứng với số rate từ 1* -> 5*

    images: [imageSchema],
    details: String,
    inStock: {
        type: Number,
        default: 0,
        min: 0
    },
    brand: {type: mongoose.SchemaTypes.ObjectId, ref:'Brand'},
    category: {type: mongoose.SchemaTypes.ObjectId, ref:'Category'},
    buyCount: {
        type: Number,
        default: 0,
        min: 0
    },
    viewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    comments: [commentSchema],
}, {autoCreate: false, timestamps: true});

productSchema.index({name: 'text', details: 'text'});

const Product = mongoose.model('Product', productSchema);

export default Product;