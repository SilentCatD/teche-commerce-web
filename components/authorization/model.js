import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    active: Boolean,
    userId: String,
}, {autoCreate: false});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;