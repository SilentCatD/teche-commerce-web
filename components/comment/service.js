import { Comment } from "./model.js"
import CommomDatabaseServies from "../common/services.js";
import ProductService from "../product/service.js";
import mongoose from "mongoose";

const CommentService = {
    returnData: (comment) => {
        if(!comment) return null;
        return {
            id: comment.id,
            userId:comment.userId.toString(),
            productId: comment.productId,
            userEmail: comment.userEmail,
            userName: comment.userName,
            description: comment.description,
            rating: comment.rating,
            createdAt: comment.createdAt.toLocaleString('en-US'),
            updatedAt: comment.updatedAt.toLocaleString('en-US'),
        }
    },
    fetchComment: async(id) => {
        const comment = await Comment.findById(id);
        return CommentService.returnData(comment);
    },
    commentQueryAll: async(productId,limit,page) => {
        const queryParams = {
            productId: mongoose.Types.ObjectId(productId),
        };
        const totalDocs = await Comment.countDocuments(queryParams);
        const comments = await Comment.find(queryParams).skip(limit*page-limit).limit(limit);
        const items = comments.map((comment)=> {
            return CommentService.returnData(comment);
        });
        return CommomDatabaseServies.queryAllFormat(totalDocs,limit,page,items);
    },
    createComment: async(userId,userEmail,userName, productId,rating,description) => {
        let docId = null;
        const session = await Comment.startSession();
        session.startTransaction();
        try {
        
        await ProductService.rateProduct(productId,rating);
        
        let commentDocObject = {
            userId: userId,
            userEmail: userEmail,
            userName: userName,
            productId:productId,
            rating: rating,
            description: description,
        }
        docId =  await Comment.create(commentDocObject);
        await session.commitTransaction();
        session.endSession();
        return docId;
    } catch (e) {
        console.log(e);
        await session.abortTransaction();
        session.endSession();
        throw e;
    } 
    },
    deleteComment: async(productId,commentId,rating) => {
        const session = await Comment.startSession();
        session.startTransaction();
        try {
            await Comment.deleteOne({_id:commentId});
            if(productId) 
                await ProductService.rateProduct(productId,-rating);
            await session.commitTransaction();
            session.endSession();
            return;
        } catch (e) {
            await session.abortTransaction();
            await session.endSession();
            throw e;
        }
    },
    editComment: async(productId,commentId,newRating,description) => {
        const session = await Comment.startSession();
        session.startTransaction();
        try {
            let comment = await Comment.findOne({_id:commentId});
            await ProductService.rateProduct(productId,-comment.rating);
            // 👉🏿👈🏿 ( behold my lazy trick)
            await ProductService.rateProduct(productId,newRating);
            comment.rating = newRating;
            comment.description = description;
            await comment.save();
            await session.commitTransaction();
            session.endSession();
            return;
        } catch (e) {
            await session.abortTransaction();
            await session.endSession();
            throw e;
        }
    },
    
}

export default CommentService;