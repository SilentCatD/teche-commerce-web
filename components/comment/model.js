import mongoose from "mongoose";
import {imageSchema} from "../image/model.js";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    userEmail: {
        type: String,
    },
    productId :{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Product",
    },
    rating: {
        type: Number,
        require: true,
        min: 1,
        max: 5,
    },
    description: {
        type: String,
    },
    images: [imageSchema],
}, {autoCreate: false, timestamps: true});


const Comment =  mongoose.model("Comment", commentSchema);
export  {Comment, commentSchema};