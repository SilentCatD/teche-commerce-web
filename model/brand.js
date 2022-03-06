import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: String,
    imageObjectId: mongoose.SchemaTypes.ObjectId
}); 

let Brand = mongoose.model('Brand',brandSchema);

export default Brand;
