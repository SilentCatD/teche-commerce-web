import mongoose from "mongoose";


const unactivatedAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
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

const resetPasswordRequest = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
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
resetPasswordRequest.index({createdAt: 1},{expires: "7d"}); //auto delete after 7d

const ResetPasswordRequest = mongoose.model('ResetPasswordRequest',resetPasswordRequest);

export  {UnactivatedAccount, ResetPasswordRequest};

