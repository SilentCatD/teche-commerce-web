import mongoose from "mongoose";
import ImageService from '../components/image/service.js'

const databaseServiceUtils = {
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
        throw new Error(`${model.collection.collectionName} ${id} found`);
      if (haveImages) {
        for (let i = 0; i < doc.images.length; i++) {
          await ImageService.deleteImage(doc.images[i].firebasePath);
        }
      }
      await model.deleteOne({ _id: doc.id });
    } catch (e) {
      throw e;
    }
  },
  deleteCollection: async(model,haveImages) => {
    const docs = await model.find();
    if(haveImages) {
    await Promise.all(docs.map(async (doc) => {
        for (let i = 0; i < doc.images.length; i++) {
            await ImageService.deleteImage(doc.images[i].firebasePath);
        }
    }));
  }
    await model.deleteMany();
  },
};

export default databaseServiceUtils;
