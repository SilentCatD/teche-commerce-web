import CommentService from './service.js';
import ProductService from '../product/service.js';
import AuthorizationController from "../authorization/controller.js";
import CommonMiddleWares from "../common/middleware.js";

// delete later
import {Comment} from "./model.js";
import Product from "../product/model.js";


import { body,param, validationResult, query } from "express-validator";

const CommentController = {
    createComment: [
        // AuthorizationController.isValidAccount,
        CommonMiddleWares.createEditCommentRequirement,
        async (req,res) => {
            try {
                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    return res.status(400).json({msg:errors.array()[0].msg});
                }
                // const user = req.user
                const {userId,userEmail,userName, productId,rating,description} = req.body;
                const docId = await CommentService.createComment(userId, userEmail,userName, productId, rating, description);

                return res.status(200).json({success:true,msg:`comment created with ${docId}`})
            } catch(e) {
                console.log(e);
                res.status(500).json({
                    success: false, 
                    msg:`can't create comment, server went wrong: ${e.msg}`
                })
            }
        }
    ],
    deleteComment: [
        // AuthorizationController.isValidAccount,
        param("commentId")
        .exists()
        .bail()
        .notEmpty({ ignore_whitespace: true })
        .withMessage("field can't be empty")
        .bail()
        .trim()
        .custom(async (commentId) => {
          const comment = await Comment.exists({_id:commentId});
          if (!comment) {
            throw new Error("comment not existed");
          }
          return true;
        }),
        async(req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                  .status(400)
                  .json({ success: false, msg: errors.array()[0].msg });
            }
            const {commentId} = req.params;
            try{
                console.log(commentId);
                const comment = await CommentService.fetchComment(commentId);
                const exists = await Product.exists({_id:comment.productId});
                if(exists) {
                    await CommentService.deleteComment(comment.productId,comment.id,comment.rating);
                } else {
                    await CommentService.deleteComment(null,comment.id,comment.rating);
                }
                res.status(200).end("Delete success");
            }catch (e) {
                console.log(e);
                res.status(500).json({
                    success: false, 
                    msg:`can't delete comment ${commentId}`
                })
            }
    },
    ],
    editComment: [async(req, res) => {

    },
    ],
    fetchAllComments: [
        CommonMiddleWares.apiQueryParamsExtract,
        param("productId")
        .exists()
        .bail()
        .notEmpty({ ignore_whitespace: true })
        .withMessage("field can't be empty")
        .bail()
        .trim()
        .custom(async (productId) => {
          const product = await ProductService.fetchProduct(productId);
          if (!product) {
            throw new Error("product not existed");
          }
          return true;
        }),
        async(req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                  .status(400)
                  .json({ success: false, msg: errors.array()[0].msg });
            }
            try {
                const {productId} = req.params;
                const {limit,page} = req.query;
                const comments = await CommentService.commentQueryAll(productId,limit,page);
                res.status(200).json({success: true, data:comments});
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    success: false, 
                    msg:`can't fetch comments, server went wrong: ${e.msg}`
                })
            }
        }
    ],
    deleteAllComments: async(req, res) => {

    },
}

export default CommentController;