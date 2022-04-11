import isInt from "../../utils/is_int.js";
import BrandService from "../brand/service.js";
import CategotyService from "../category/service.js";
import ImageService from "../image/service.js";
import Product from "./model.js";
import mongoose from "mongoose";
import CommomDatabaseServies from "../common/services.js";

const ProductService = {
  createProduct: async (
    name,
    price,
    unit,
    brandId,
    categoryId,
    details,
    imageFiles
  ) => {
    let images = [];
    images = await Promise.all(
      imageFiles.map(async (imageFile) => {
        return await ImageService.createImage(imageFile);
      })
    );

    let productDocObj = {
      name: name,
      price: price,
      brand: brandId,
      inStock: unit,
      category: categoryId,
      details: details,
      images: images,
      rates: [0, 0, 0, 0, 0],
    };
    await BrandService.editProductHolds(brandId, '+');
    await CategotyService.editProductHolds(categoryId, '+');
    return await CommomDatabaseServies.createDocument(Product, productDocObj);
  },

  // Mising edit product,category holds
  deleteAllProduct: async () => {
    await CommomDatabaseServies.deleteCollection(Product, true);
  },

  productQueryAll: async (range, limit, page, sortParams, brand, category, query) => {
    let queryParams = {
      ...range,
      ...(brand && {brand: mongoose.Types.ObjectId(brand)}),
      ...(category && {category: mongoose.Types.ObjectId(category)}),
      ...(query  && {$text: {$search: query}}),
    };
    const totalCount = await Product.countDocuments(queryParams);
    const products = await Product.find(queryParams)
      .populate("brand")
      .populate("category")
      .skip(limit * page - limit)
      .limit(limit)
      .sort(sortParams);
    const items =  products.map((product) => {
      return ProductService.returnData(product);
    });
    return CommomDatabaseServies.queryAllFormat(totalCount, limit, page, items);
  },

  returnData: (product) => {
    if (!product) return null;
    let imageUrls = [];
    for (let i = 0; i < product.images.length; i++) {
      imageUrls.push(product.images[i].firebaseUrl);
    }
    let status = "sold-out";
    if (product.inStock > 0) {
      status = "in-stock";
    }
    let rateSum = 0;
    product.rates.forEach((element) => {
      rateSum += element;
    });

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      rateAverage: product.rateAverage,
      rateCount: rateSum,
      rates: product.rates,
      images: imageUrls,
      details: product.details,
      status: status,
      unit: product.inStock,
      brand: BrandService.returnData(product.brand),
      category: CategotyService.returnData(product.category),
      buyCount: product.buyCount,
      viewCount: product.viewCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  },

  fetchProduct: async (id) => {
      const product = await Product.findById(mongoose.mongo.ObjectId(id))
        .populate("brand")
        .populate("category");
      return ProductService.returnData(product);
  },

  deleteProduct: async (id) => {
    await CommomDatabaseServies.deleteDocument(Product, id, true);
  },

  rateProduct: async (id, rate) => {
    if (!isInt(rate) && (rate < 1 || rate > 5)) {
      throw Error("Invalid rate");
    }
    const session = await Product.startSession();
    session.startTransaction();
    try {
      const product = await Product.findById(
        mongoose.Types.ObjectId(id)
      ).session(session);
      if (product === null) throw new Error(`Product ${id} is not existed`);
      let rates = product.rates;
      rates[rate - 1] = rates[rate - 1] + 1;
      let totalRates = 0;
      let totalStars = 0;
      let rateAverage = 0;
      for (let i = 0; i < 5; i++) {
        totalRates += rates[i];
        totalStars += rates[i] * (i + 1);
      }
      if (totalRates != 0) {
        rateAverage = totalStars / totalRates;
      }
      product.rateAverage = rateAverage;
      product.rates = rates;
      await product.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },

  editProduct: async (
    id,
    name,
    price,
    unit,
    brandId,
    categoryId,
    details,
    imageFiles,
  ) => {
    const session = await Product.startSession();
    session.startTransaction();
    try {
      const product = await Product.findById(
        mongoose.Types.ObjectId(id)
      ).populate('brand').populate('category').session(session);
      product.name = name;
      product.price = price;
      product.details = details;
      product.inStock = unit;
 
      if(product.brand){
        await BrandService.editProductHolds(product.brand, '-'); 
      }
      product.brand = brandId;
      await BrandService.editProductHolds(brandId, '+'); 

      if(product.category){
        await CategotyService.editProductHolds(product.category, '-'); 
      }
      product.category = categoryId;
      await CategotyService.editProductHolds(categoryId, '+'); 

      await Promise.all(product.images.map( async (image)=>{
        await ImageService.deleteImage(image.firebasePath);
      }));

      product.images = await Promise.all(imageFiles.map( async (image)=>{
        return await ImageService.createImage(image);  
      }));
      await product.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
};

export default ProductService;
