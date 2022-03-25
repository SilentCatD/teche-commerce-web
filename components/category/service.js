import Category from "./model.js";
import isInt from '../../utils/is_int.js';
import mongoose from "mongoose";
import calculatePaging from "../../utils/calculatePaging.js";
import databaseServiceUtils from "../../utils/databaseServiceUtils.js";


const CategotyService = {
    createCategory: async (name) =>{
        return databaseServiceUtils.createDocument(Category,{name:name});
    },
    fetchAllCategory: async(page,limit, sort, type) =>{
        let sortedParams = {};
        if (type != 1 && type != -1) {
            type = -1;
        }
        if (sort) {
            sortedParams[sort] = type;
        }

        let pagingResult = await calculatePaging(page,limit,Category);
        
        const categories = await Category.find().limit(pagingResult.limit).sort(sortedParams).skip(pagingResult.skipItem);
        const result = {};
        
        result.items = categories.map((category) => {
            return {
                id: category.id,
                name: category.name,
                productsHold: category.productsHold,
                rankingPoints: category.rankingPoints
            };
        });
        result.totalPage = pagingResult.totalPage;
        result.totalItem = pagingResult.totalItem;

        return result;
    },

    deleteAllCategory: async() =>{
        databaseServiceUtils.deleteCollection(Category,false);
    },

    fetchCategory: async(id) => {
        try {
        const category = await Category.findById(mongoose.mongo.ObjectId(id));
        if(category === null) {
            throw new Error(`Category ${id} is not existed`);
        }
        return {
            id: category.id,
            name: category.name,
            productsHold: category.productsHold,
            rankingPoints: category.rankingPoints
        };
    }catch (e) {
        throw e;
    }
    },

    deleteCategory: async (id) =>{
        databaseServiceUtils.deleteDocument(Category,id,false);
    },

    editProductHolds: async (id, op) => {
        databaseServiceUtils.editProductHolds(Category,id,op);
    },
    editrankingPoints: async (id, op) => {
        // editrankingPoints(id, '+') => plus 1
        databaseServiceUtils.editRankingPoints(Category,id,op);
    },

    editCategory: async (id, name)=>{
        //  undefined => not change
        const session = await Category.startSession();
        session.startTransaction();
        try {
            const category = await Category.findById(mongoose.Types.ObjectId(id)).session(session);
            if(category === null) {
                throw new Error(`Category ${id} is not existed`);
            }
            if(name){
                category.name=name;
            }
            await category.save();
            await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally{
            await session.endSession();
        }
    },

    calculatePaging: async(limit,page,model) => {
        const result = {};
        result.totalItem = await Category.countDocuments();
        if(!isInt(limit)) {
            result.totalPage = 1;
            result.skipItem = 0;
            result.limit = null;
            
        } else {
            if(!isInt(page) || page < 1) page = 1;
            result.totalPage = Math.floor(result.totalItem / limit);
            result.skipItem = limit*page;
            result.limit = limit;
        }
        return result;
    }
}

export default CategotyService;