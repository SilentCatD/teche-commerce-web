import Category from "./model.js";
import mongoose from "mongoose";
import calculatePaging from "../../utils/calculatePaging.js";
import CommomDatabaseServies from "../common/services.js";


const CategotyService = {
    createCategory: async (name) =>{
        return CommomDatabaseServies.createDocument(Category,{name:name});
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
        CommomDatabaseServies.deleteCollection(Category,false);
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
        CommomDatabaseServies.deleteDocument(Category,id,false);
    },

    editProductHolds: async (id, op) => {
        CommomDatabaseServies.editProductHolds(Category,id,op);
    },
    editrankingPoints: async (id, op) => {
        // editrankingPoints(id, '+') => plus 1
        CommomDatabaseServies.editRankingPoints(Category,id,op);
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

}

export default CategotyService;