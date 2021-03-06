import ImageService from "../image/service.js";
import Brand from "./model.js";
import mongoose from "mongoose";
import CommomDatabaseServies from "../common/services.js";
import Product from "../product/model.js";

const BrandService = {
  createBrand: async (name, img) => {
    // name: <String> Sname of the brand
    // img: <File> object represent the file
    const imgObj =  await ImageService.createImage(img);
    let brandDocObject = { name: name, image: imgObj };
    return await Brand.create(brandDocObject);
  },

  deleteAllBrand: async () => {
    const brands = await Brand.find();
    await Promise.all(brands.map(async (brand)=>{
      await BrandService.deleteBrand(brand.id);
    }));
  },
  returnData: (brand) => {
    if(!brand) return null;
    let imgLink = null;
    if (brand.image) {
      imgLink = brand.image.firebaseUrl;
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
    const brand = await Brand.findById(id);
    if(brand.image){
      await ImageService.deleteImage(brand.image.firebasePath);
    }
    const products = Product.find({brand: id});
    if(products && products.length > 0){
      await Promise.all(products.map(async (product)=>{
        product.brand = null;
        await product.save();
      }));
    }


    await brand.remove();
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
