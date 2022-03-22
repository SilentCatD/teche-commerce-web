import Category from "./model.js";
import isInt from '../../utils/is_int.js';
import mongoose from "mongoose";

const CategotyService = {
    createCategory: async (name) =>{
        let category = new Category({ name: name });
        await category.save();
        console.log("Category created");
        return category.id;
    },
    fetchAllCategory: async(limit, sort, type) =>{
        let sortedParams = {};
        if (type != 1 && type != -1) {
            type = -1;
        }
        if (sort) {
            sortedParams[sort] = type;
        }
        limit = isInt(limit) ? limit : null;
        const results = await Category.find().limit(limit).sort(sortedParams);
        return results.map((category) => {
            return {
                id: category.id,
                name: category.name,
                productsHold: category.productsHold,
                rankingPoints: category.rankingPoints
            };
        });
    },

    deleteAllCategory: async() =>{
        await Category.deleteMany({});
    },

    fetchCategory: async(id) => {
        console.log(id);
        const category = await Category.findById(mongoose.mongo.ObjectId(id));
        return {
            id: category.id,
            name: category.name,
            productsHold: category.productsHold,
            rankingPoints: category.rankingPoints
        };
    },

    deleteCategory: async (id) =>{
        const category = await Category.findById(mongoose.Types.ObjectId(id));
        await Category.deleteOne({ _id: category.id });

    },

    editProductHolds: async (id, op) => {
        // editProductHolds(id, '+') => plus 1
        const session = await Category.startSession();
        session.startTransaction();
        try {
            const category = await Category.findById(mongoose.Types.ObjectId(id)).session(session);
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
            if(name!==undefined){
                if(name===null){
                    category.name='';
                }else{
                    category.name = name;
                }
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
}

export default CategotyService;