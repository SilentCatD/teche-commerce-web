import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    userId: String,
}, {autoCreate: false, timestamps: true});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);


export default RefreshToken;

