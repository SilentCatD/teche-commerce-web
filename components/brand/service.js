import ImageService from "../image/service.js";
import Brand from "./model.js";
import mongoose from "mongoose";
import CommomDatabaseServies from "../common/services.js";

const BrandService = {
  createBrand: async (name, img) => {
    // name: <String> Sname of the brand
    // img: <File> object represent the file
    let brandImg = [];
    if(img.length > 0){
      const imgId =  await ImageService.createImage(img[0]);
      brandImg.push(imgId);
    }
    let brandDocObject = { name: name, images: brandImg };
    return await CommomDatabaseServies.createDocument(Brand, brandDocObject);
  },

  deleteAllBrand: async () => {
    await CommomDatabaseServies.deleteCollection(Brand, true);
  },
  returnData: (brand) => {
    if(!brand) return null;
    let brandImg = brand.images;
    let imgLink = null;
    if (brandImg.length > 0) {
      imgLink = brandImg[0].firebaseUrl;
    }
    return {
      id: brand.id,
      name: brand.name,
      image: imgLink,
      createdAt: brand.createdAt,
      rankingPoints: brand.rankingPoints,
      productsHold: brand.productsHold,
    };
  },
  brandQueryAll: async(range, limit, page, sortParams, query)=>{
    let queryParams = {
      ...range,
      ...(query  && {$text: {$search: query}}),
    };
    const totalCount = await Brand.countDocuments(queryParams);
    const brands = await Brand
    .find(queryParams)
    .skip(limit * page - limit)
    .limit(limit)
    .sort(sortParams);
    const items =  brands.map((brand)=>{return BrandService.returnData(brand)});
    return CommomDatabaseServies.queryAllFormat(totalCount, limit, page, items);
},

  fetchBrand: async (id) => {
    try {
      const brand = await Brand.findById(mongoose.mongo.ObjectId(id));
      if (brand === null) {
        throw new Error(`Brand ${id} is not existed`);
      }
      return BrandService.returnData(brand);
    } catch (e) {
      throw e;
    }
  },

  deleteBrand: async (id) => {
    await CommomDatabaseServies.deleteDocument(Brand, id, true);
  },

  editProductHolds: async (id, op) => {
    // editProductHolds(id, '+') => plus 1
    await CommomDatabaseServies.editProductHolds(Brand, id, op);
  },
  editrankingPoints: async (id, op) => {
    // editrankingPoints(id, '+') => plus 1
    await CommomDatabaseServies.editRankingPoints(Brand, id, op);
  },

  editBrand: async (id, name, image) => {
    // image undefined => not change
    // image null => delete brand Image
    const session = await Brand.startSession();
    session.startTransaction();
    try {
      const brand = await Brand.findById(mongoose.Types.ObjectId(id)).session(
        session
      );
      if (brand === null) {
        throw new Error(`Brand ${id} is not existed`);
      }
      if (name) {
        brand.name = name;
      }
      if (image !== undefined) {
        if (brand.image) {
          await ImageService.deleteImage(brand.image.firebasePath);
          brand.image = null;
        }
        if (image) {
          const newImg = await ImageService.createImage(image);
          brand.image = newImg;
        }
      }
      await brand.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
};

export default BrandService;
