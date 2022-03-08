import mongoose from "mongoose";

const categoryScheme = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
});

const Category = mongoose.model('Category',categoryScheme);

export default Category;
