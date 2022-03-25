import Category from "./model.js";
import isInt from '../../utils/is_int.js';
import mongoose from "mongoose";
import calculatePaging from "../../utils/calculatePaging.js";


const CategotyService = {
    createCategory: async (name) =>{
        let category = new Category({ name: name });
        await category.save();
        console.log("Category created");
        return category.id;
    },
    fetchAllCategory: async(page,limit, sort, type) =>{
        let sortedParams = {};
        if (type != 1 && type != -1) {
            type = -1;
        }
        if (sort) {
            sortedParams[sort] = type;
        }

        let pagingResult = await calculatePaging(limit,page,Category);
        
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
        await Category.deleteMany({});
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
        try {
            const category = await Category.findById(mongoose.Types.ObjectId(id));
            if(category === null) {
                throw new Error(`Category ${id} is not existed`);
            }
        await Category.deleteOne({ _id: category.id });
        } catch (e) {
            throw e;
        }

    },

    editProductHolds: async (id, op) => {
        // editProductHolds(id, '+') => plus 1
        const session = await Category.startSession();
        session.startTransaction();
        try {
            const category = await Category.findById(mongoose.Types.ObjectId(id)).session(session);
            if(category === null) {
                throw new Error(`Category ${id} is not existed`);
            }
            if (!op){
                throw Error("operation not specifief");
            }
            if(op=='+'){
                category.productsHold = category.productsHold + 1;

            }else if(op=='-'){
                category.productsHold = category.productsHold - 1;
            }else{
                throw Error("operation invalid");
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
    editrankingPoints: async (id, op) => {
        // editrankingPoints(id, '+') => plus 1
        const session = await Category.startSession();
        session.startTransaction();
        try {
            const category = await Category.findById(mongoose.Types.ObjectId(id)).session(session);
            if(category === null) {
                throw new Error(`Category ${id} is not existed`);
            }
            if (!op){
                throw Error("operation not specifief");
            }
            if(op=='+'){
                category.rankingPoints = category.rankingPoints + 1;

            }else if(op=='-'){
                category.rankingPoints = category.rankingPoints - 1;
            }else{
                throw Error("operation invalid");
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