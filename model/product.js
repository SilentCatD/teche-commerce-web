// TODO: Review this
//
// import mongoose from "mongoose";
//
// const productScheme = new mongoose.Schema({
//     name:{
//       type: String,
//       required: true
//     },
//     category: mongoose.SchemaTypes.ObjectId,
//     publisher: mongoose.SchemaTypes.ObjectId,
//     rewviewCount: {
//       type: Number,
//       min: 0,
//       default: 0,
//     },
//     reviewRate: {
//       type: Number,
//       min: 0,
//       max:5,
//       default: 0
//     },
//     quantity: {
//       type: Number,
//       min: 0,
//       default: 0
//     } ,
//     price: Number,
//     imageObjectId: mongoose.SchemaTypes.ObjectId
// });
//
// const Product = mongoose.model('Product',productScheme);
//
// export default Brand;
