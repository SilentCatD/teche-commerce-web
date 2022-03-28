import mongoose from "mongoose";
import ImageService from "../image/service.js";

const CommomDatabaseServies = {
  createDocument: async (model, object) => {
    let newDocument = new model(object);
    await newDocument.save();
    console.log(model.collection.collectionName + " Created");
    return newDocument.id;
  },

  editProductHolds: async (model, id, op) => {
    const session = await model.startSession();
    session.startTransaction();
    try {
      const modelDoc = await model
        .findById(mongoose.Types.ObjectId(id))
        .session(session);
      if (modelDoc === null) {
        throw new Error(
          `${model.collection.collectionName} ${id} is not existed`
        );
      }
      if (!op) {
        throw Error("operation not specifief");
      }
      if (op == "+") {
        modelDoc.productsHold++;
      } else if (op == "-") {
        modelDoc.productsHold--;
      } else {
        throw Error("operation invalid");
      }
      await modelDoc.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },

  editrankingPoints: async (model, id, op) => {
    const session = await model.startSession();
    session.startTransaction();
    try {
      const modelDoc = await model
        .findById(mongoose.Types.ObjectId(id))
        .session(session);
      if (modelDoc === null) {
        throw new Error(
          `${model.collection.collectionName} ${id} is not existed`
        );
      }
      if (!op) {
        throw Error("operation not specifief");
      }
      if (op == "+") {
        modelDoc.rankingPoints++;
      } else if (op == "-") {
        modelDoc.rankingPoints--;
      } else {
        throw Error("operation invalid");
      }
      await modelDoc.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },

  deleteDocument: async (model, id, haveImages) => {
    try {
      const doc = await model.findById(mongoose.Types.ObjectId(id));
      if (doc === null)
        throw new Error(`${model.collection.collectionName} ${id} not found`);
      if (haveImages) {
        await Promise.all(doc.images.map( async (image)=>{
          await ImageService.deleteImage(image.firebasePath);
        }));
      }
      await model.deleteOne({ _id: doc.id });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  deleteCollection: async (model, haveImages) => {
    const docs = await model.find();
    if (haveImages) {
      await Promise.all(docs.map( async (doc)=>{
        await Promise.all(doc.images.map( async (image)=>{
          await ImageService.deleteImage(image.firebasePath);
        }));
      }));
    }
    await model.deleteMany();
  },
  queryAllWithModel: async (model, modelService, limit, page, sortParams, range) => {
    const totalCount = await model.countDocuments(range);
    let totalPages = Math.ceil(totalCount / limit);
    if (totalPages == 0) {
      totalPages = 1;
    }
    if (page && page > totalPages) {
      page = totalPages;
    }
    const items = await modelService.modelQueryAll(range, limit, page, sortParams);
    const result = {
      ...(limit && { "total-pages": totalPages }),
      ...(limit && { "current-page": page ? page : 1 }),
      "total-items": totalCount,
      "item-count": items.length,
      items: items,
    };
    return result;
  },
};

export default CommomDatabaseServies;
