import mongoose from "mongoose";


const unactivatedAccountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    hash:{
        type: String,
        required: true,
    }
}, {autoCreate: false});


const UnactivatedAccount = mongoose.model('UnactivatedAccount',unactivatedAccountSchema);

export default UnactivatedAccount;

