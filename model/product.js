import mongoose from "mongoose";
import Comment from "./comment";

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
    variants: [
        {
            name: String,
            hexValue: String,
            imageId: mongoose.SchemaTypes.ObjectId,
        }
    ],

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
    comments: [Comment],
}
);


const Product = mongoose.model('Product',productSchema);

export default Product;