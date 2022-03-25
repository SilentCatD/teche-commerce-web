import mongoose from "mongoose";
import { imageSchema } from "../image/model.js";

const brandSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    images: [imageSchema],
    productsHold: {
      type: Number,
      default: 0,
    },
    rankingPoints: {
      type: Number,
      default: 0,
    },
}, { autoCreate: false , timestamps: true});

const Brand = mongoose.model('Brand',brandSchema);

export default Brand;
