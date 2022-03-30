import mongoose from "mongoose";


const unactivatedAccountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    hash:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
}, {autoCreate: false});

unactivatedAccountSchema.index({createdAt: 1},{expires: "7d"}); //auto delete after 7d

const UnactivatedAccount = mongoose.model('UnactivatedAccount',unactivatedAccountSchema);



export default UnactivatedAccount;

