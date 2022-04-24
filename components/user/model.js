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
   avatar: {
      type: imageSchema,
      default: null,
   },
   active: {
      type: Boolean,
      default: false,
   },
}, { autoCreate: false, timestamps: true });

userSchema.index({name: 'text', email: 'text'});

const User = mongoose.model('User',userSchema);

export default User;
