import express from "express";
import multer from "multer";
import CommentController from "../../../../components/comment/controller.js";


const commentRouter = express.Router();

commentRouter.route('/')
    .post(CommentController.createComment)
    .delete(CommentController.deleteAllComments);

commentRouter.route("/:productId")
    .get(CommentController.fetchAllComments);
    
commentRouter.route('/:commentId')
    .delete(CommentController.deleteComment)
    .put(CommentController.editComment);

export default commentRouter;