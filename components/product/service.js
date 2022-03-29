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
    return await CommomDatabaseServies.createDocument(Product, productDocObj);
  },

  // Mising edit product,category holds
  deleteAllProduct: async () => {
    await CommomDatabaseServies.deleteCollection(Product, true);
  },

  modelQueryAll: async (range, limit, page, sortParams) => {
    const products = await Product.find(range)
      .populate("brand")
      .populate("category")
      .skip(limit * page - limit)
      .limit(limit)
      .sort(sortParams);
    return products.map((product) => {
      return ProductService.returnData(product);
    });
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
      if (product === null) throw new Error(`Product ${id} is not found`);
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
    brandId,
    categoryId,
    details,
    imageFiles
  ) => {
    // imageFiles undeinfed => not edit
    const session = await Product.startSession();
    session.startTransaction();
    try {
      const product = await Product.findById(
        mongoose.Types.ObjectId(id)
      ).session(session);
      if (product === null) throw new Error(`Product ${id} is not found`);
      if (name) {
        product.name = name;
      }
      if (price) {
        product.price = price;
      }
      if (details) {
        product.details = details;
      }
      if (brandId) {
        try {
          await BrandService.fetchBrand(brandId);
          await BrandService.editProductHolds(brandId, "+");
        } catch (e) {
          throw Error("Brand not existed");
        }
        if (product.brand) {
          await BrandService.editProductHolds(product.brand, "-");
        }
        product.brand = brandId;
      }

      if (categoryId) {
        try {
          await CategotyService.fetchCategory(categoryId);
          await CategotyService.editProductHolds(categoryId, "+");
        } catch (e) {
          throw Error("Category not existed");
        }
        if (product.category) {
          await CategotyService.editProductHolds(product.category, "-");
        }
        product.category = categoryId;
      }
      if (imageFiles !== undefined) {
        let images = [];
        for (let i = 0; i < imageFiles.length; i++) {
          let imageModel = await ImageService.createImage(imageFiles[i]);
          images.push(imageModel);
        }
        for (let i = 0; i < product.images.length; i++) {
          await ImageService.deleteImage(product.images[i].firebasePath);
        }
        product.images = images;
      }
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
