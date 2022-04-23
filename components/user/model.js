import mongoose from "mongoose";
import { imageSchema } from "../image/model.js";

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      default: "site-user",
   },
   email: String,
   hash: String,
   salt: String,
   role: String, // 'user', 'admin'
   avatar: imageSchema,
   active: {
      type: Boolean,
      default: false,
   },
}, { autoCreate: false });

const User = mongoose.model('User',userSchema);

export default User;
