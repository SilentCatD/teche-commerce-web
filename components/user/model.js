import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   thirdPartyID: String,
   name: String,
   email: String,
   hash: String,
   salt: String,
   role: String, // 'user', 'admin'
   active: {
      type: Boolean,
      default: false,
   },
}, { autoCreate: false });

const User = mongoose.model('User',userSchema);

export default User;
