import mongoose from "mongoose";
import ImageService from "../image/service.js";

const CommomDatabaseServies = {
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

  editRankingPoints: async (model, id, op) => {
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

  queryAllFormat: async (totalCount, limit, page, items) => {
    let totalPages = Math.ceil(totalCount / limit);
    if (totalPages == 0) {
      totalPages = 1;
    }
    if (page && page > totalPages) {
      page = totalPages;
    }
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
