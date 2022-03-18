import { Comment } from "./model.js"

const CommentService = {
    createComment: async(userId ,text)=>{
        return new Comment({userId: userId, text: text});
    },
}