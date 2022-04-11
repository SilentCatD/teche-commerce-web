import { Comment } from "./model.js"
import CommomDatabaseServies from "../common/services.js";
import ProductService from "../product/service.js";
const CommentService = {
    returnData: (comment) => {
        if(!comment) return null;
        return {
            id: comment.id,
            productId: comment.productId,
            userEmail: comment.userEmail,
            description: comment.description,
            rating: comment.rating,
            createAt: comment.createAt,
            updateAt: comment.updateAt,
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
        const comments = await Comment.find(queryParams).sort(sortParams).skip(limit*page-limit).limit(limit);
        const items = comments.map((comment)=> {
            return CommentService.returnData(comments);
        });
        return CommomDatabaseServies.queryAllFormat(totalDocs,limit,page,items);
    },
    createComment: async(userId,userEmail, productId,rating,description) => {
        let docId = null;
        const session = await Comment.startSession();
        session.startTransaction();
        try {
        
        await ProductService.rateProduct(productId,rating);
        
        let commentDocObject = {
            userId: userId,
            userEmail: userEmail,
            productId:productId,
            rating: rating,
            description: description,
        }
        docId =  await CommomDatabaseServies.createDocument(Comment,commentDocObject);
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
            await CommomDatabaseServies.deleteDocument(Comment,commentId,false);
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
}

export default CommentService;