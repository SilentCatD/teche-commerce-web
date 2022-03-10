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
    images: [mongoose.SchemaTypes.ObjectId],
});


const Comment =  mongoose.model("Comment", commentSchema);
export default Comment;