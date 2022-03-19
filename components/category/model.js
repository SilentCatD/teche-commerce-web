import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    productsHold: {
      type: Number,
      default: 0,
    },
    rankingPoints: {
      type: Number,
      default: 0,
    },
}, { autoCreate: false });

const Category = mongoose.model('Category',categorySchema);

export default Category;
