import mongoose from "mongoose";
import {Comment,  commentSchema } from "./comment.js";

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
    rate: {
        type: Number,
        default: 0,
        min: 0
    },
    images: [mongoose.SchemaTypes.ObjectId],

    details: String,
    inStock: {
        type: Number,
        default: 0,
        min: 0
    },
    brand: mongoose.SchemaTypes.ObjectId,
    category: mongoose.SchemaTypes.ObjectId,
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
}
);


const Product = mongoose.model('Product',productSchema);

export default Product;