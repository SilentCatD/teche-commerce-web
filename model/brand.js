import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    imageObjectId: mongoose.SchemaTypes.ObjectId,
    rankingPoints: {
      type: Number,
      default: 0,
    },
});

const Brand = mongoose.model('Brand',brandSchema);

export default Brand;
