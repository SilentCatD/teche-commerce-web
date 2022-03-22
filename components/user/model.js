import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   email: String,
   hash: String,
   salt: String,
   role: String, // 'user', 'admin'
}, { autoCreate: false });

const User = mongoose.model('User',userSchema);

export default User;
