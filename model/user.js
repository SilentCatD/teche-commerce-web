import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
      type: String,
      required: true
  },
  email: String,
  role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    }
  
});

const User = mongoose.model('User',userSchema);

export default User;
