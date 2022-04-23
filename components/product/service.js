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
    return await Product.create(productDocObj);
  },

  deleteAllProduct: async () => {
    const products = await Product.find();
    await Promise.all(products.map( async (product)=>{
      await ProductService.deleteProduct(product.id);
    }));
  },

  productQueryAll: async (range, limit, page, sortParams, brands, categories, query) => {
    const brandsParams = {};
    const categoriesParams = {};
    if(brands && brands.length > 0){
      brandsParams['brand'] = {"$in": brands};
    }
    if(categories && categories.length > 0){
      categoriesParams['category'] = {"$in": categories};
    }
    let queryParams = {
      ...range,
      ...(brandsParams && brandsParams),
      ...(categoriesParams && categoriesParams),
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
    const product = await Product.findById(id);
    if(product.brand){
      await BrandService.editProductHolds(product.brand, '-');
    }
    if(product.category){
      await CategotyService.editProductHolds(product.category,'-');
    }
    await Promise.all(product.images.map( async (image)=>{
      await ImageService.deleteImage(image.firebasePath);
    }));
    await product.remove();
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


  rateProduct: async (id, rate) => {
    const session = await Product.startSession();
    session.startTransaction();
    try {
      let temp_1 =  (rate > 0 ) ? 1 : -1;

      rate = Math.abs(rate);
      const product = await Product.findById(
        mongoose.Types.ObjectId(id)
      ).session(session);
      if (product === null) throw new Error(`Somehow Product ${id} is not existed`);
      let rates = product.rates;

      rates[rate - 1] = rates[rate - 1] + temp_1;

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

  editProductStock: async (
    id,
    unit,
  ) => {
    const session = await Product.startSession();
    session.startTransaction();
    try {
      const product = await Product.findById(
        mongoose.Types.ObjectId(id)
      )
      
      if(product.inStock + unit < 0) {
        throw new Error("OutStock (The fuck)!")
      }
      product.inStock+=unit;

      await product.save();
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  },
  getRelated: async(id, limit)=>{
    if(!limit){
      limit = 6;
    }
    const product = await Product.findById(id);
    let relatedProducts = await ProductService.productQueryAll(null, limit, 1, null, [product.brand], [product.category]);
    let lost = 0;
    relatedProducts.items = relatedProducts.items.filter((item)=>{
      if(item.id!=product.id){
        lost++;
        return true;
      }
      return false;
    });
    relatedProducts['total-items']-= lost;
    delete relatedProducts['item-count'];
    delete relatedProducts['total-pages'];
    delete relatedProducts['current-page'];
    return relatedProducts;
  },
};

export default ProductService;
