import { Comment } from "./model.js"
import CommomDatabaseServies from "../common/services.js";
import ProductService from "../product/service.js";
import mongoose from "mongoose";

const CommentService = {
    returnData: (comment) => {
        if(!comment) return null;
        let avatar = null;
        if(comment.userId.avatar) avatar = comment.userId.avatar.firebaseUrl;
        return {
            id: comment.id,
            userId:comment.userId.id,
            productId: comment.productId,
            userEmail: comment.userId.email,
            userName: comment.userId.name,
            description: comment.description,
            rating: comment.rating,
            createdAt: comment.createdAt.toLocaleString('en-US'),
            updatedAt: comment.updatedAt.toLocaleString('en-US'),
            avatar: avatar,
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
        const comments = await Comment.find(queryParams).skip(limit*page-limit).limit(limit).populate("userId");
        const items = comments.map((comment)=> {
            return CommentService.returnData(comment);
        });
        return CommomDatabaseServies.queryAllFormat(totalDocs,limit,page,items);
    },
    createComment: async(userId, productId,rating,description) => {
        let docId = null;
        const session = await Comment.startSession();
        session.startTransaction();
        try {
        
        await ProductService.rateProduct(productId,rating);
        
        let commentDocObject = {
            userId: userId,
            productId:productId,
            rating: rating,
            description: description,
        }
        await Comment.create(commentDocObject);
        await session.commitTransaction();
    } catch (e) {
        await session.abortTransaction();
        throw e;
    } finally{
        await session.endSession();
        return;
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
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            await session.endSession();
            return;
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
            return;
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            await session.endSession();
            return;
        }
    },
    
}

export default CommentService;