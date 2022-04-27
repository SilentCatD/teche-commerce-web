import Category from "./model.js";
import mongoose from "mongoose";
import CommomDatabaseServies from "../common/services.js";
import Product from "../product/model.js";

const CategotyService = {
  createCategory: async (name) => {
    return await Category.create({name: name});
  },

  deleteAllCategory: async () => {
    const categories =  await Category.find();
    await Promise.all(categories.map(async(category)=>{
      CategotyService.deleteCategory(category.id);
    }));
  },

  fetchCategory: async (id) => {
    try {
      const category = await Category.findById(mongoose.mongo.ObjectId(id));
      if (category === null) {
        throw new Error(`Category ${id} is not existed`);
      }
      return CategotyService.returnData(category);
    } catch (e) {
      throw e;
    }
  },

  returnData: (category) => {
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      productsHold: category.productsHold,
      rankingPoints: category.rankingPoints,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  },

  categoryQueryAll: async (range, limit, page, sortParams, query) => {
    let queryParams = {
      ...range,
      ...(query  && {$text: {$search: query}}),
    };
    const totalCount = await Category.countDocuments(queryParams);
    const categories = await Category.find(queryParams)
      .skip(limit * page - limit)
      .limit(limit)
      .sort(sortParams);
    const items = categories.map((category) => {
      return CategotyService.returnData(category);
    });
    return CommomDatabaseServies.queryAllFormat(totalCount, limit, page, items);
  },

  deleteCategory: async (id) => {
    const products = await Product.find({category: id});
    if(products && products.length > 0){
      await Promise.all(products.map(async (product)=>{
        product.category = null;
        await product.save();
      }));
    }
    await Category.deleteOne({_id: id});
  },

  editProductHolds: async (id, op) => {
    await CommomDatabaseServies.editProductHolds(Category, id, op);
  },
  editrankingPoints: async (id, op) => {
    await CommomDatabaseServies.editRankingPoints(Category, id, op);
  },

  editCategory: async (id, name) => {
    const session = await Category.startSession();
    session.startTransaction();
    try {
      const category = await Category.findById(
        mongoose.Types.ObjectId(id)
      ).session(session);
      if (category === null) {
        throw new Error(`Category ${id} is not existed`);
      }
      if (name) {
        category.name = name;
      }
      await category.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
};

export default CategotyService;
