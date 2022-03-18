import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {autoCreate: false});


const Comment =  mongoose.model("Comment", commentSchema);
export  {Comment, commentSchema};