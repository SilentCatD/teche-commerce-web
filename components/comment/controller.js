import CommentService from './service.js';
import ProductService from '../product/service.js';
import AuthorizationController from "../authorization/controller.js";
import CommonMiddleWares from "../common/middleware.js";

// delete later
import {Comment} from "./model.js";
import Product from "../product/model.js";


import {param, validationResult } from "express-validator";

const CommentController = {
    createComment: [
        AuthorizationController.isValidAccount,
        CommonMiddleWares.createEditCommentRequirement,
        async (req,res) => {
            try {
                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    return res.status(400).json({msg:errors.array()[0].msg});
                }
                const {productId,rating,description} = req.body;
                const docId = await CommentService.createComment(req.user.id, req.user.email,req.user.name, productId, rating, description);
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
        AuthorizationController.isValidAccount,
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
                const comment = await CommentService.fetchComment(commentId);
                const exists = await Product.exists({_id:comment.productId});
                if((comment.userId != req.user.id) || (req.user.role == "admin")) {
                    throw new Error("You are wizard!");
                }
                if(exists) {
                    await CommentService.deleteComment(comment.productId,comment.id,comment.rating);
                } else {
                    await CommentService.deleteComment(null,comment.id,comment.rating);
                }
                res.status(200).end("Delete success");
            }catch (e) {
                console.log(e.message);
                res.status(500).json({
                    success: false, 
                    msg:`cant not delete comment, ${e.message}`,
                })
            }
    },
    ],
    editComment: [
        AuthorizationController.isValidAccount,
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
        CommonMiddleWares.createEditCommentRequirement,
        async(req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                  .status(400)
                  .json({ success: false, msg: errors.array()[0].msg });
            }
            const {productId,rating,description} = req.body;
            const {commentId} = req.params;
            try{
                const comment = await CommentService.fetchComment(commentId);
                if((comment.userId != req.user.id) ) {
                    throw new Error("You are wizard!");
                }
                await CommentService.editComment(productId,commentId,rating,description);
                res.status(200).end("Edit success");
            }catch (e) {
                console.log(e.message);
                res.status(500).json({
                    success: false, 
                    msg:`cant not delete comment, ${e.message}`,
                })
            }

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