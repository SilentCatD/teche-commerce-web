import isInt from "../../utils/is_int.js";
import BrandService from "../brand/service.js";
import CategotyService from "../category/service.js";
import ImageService from "../image/service.js";
import Product from "./model.js";
import mongoose from "mongoose";
import { async } from "@firebase/util";
import databaseServiceUtils from "../../utils/databaseServiceUtils.js";

const ProductService = {
    createProduct: async (name, price, brandId, categoryId, details, imageFiles) => {
        let images = []
        for (let i = 0; i < imageFiles.length; i++) {
            let imageModel = await ImageService.createImage(imageFiles[i]);
            images.push(imageModel);
        }
        let brand = null;
        if (brandId) {
            try {
                await BrandService.fetchBrand(brandId);
                brand = brandId;
                await BrandService.editProductHolds(brandId, '+');
            } catch (e) {
                throw Error("Brand not existed");
            }
        }
        let category = null;
        if (categoryId) {
            try {
                await CategotyService.fetchCategory(categoryId);
                category = categoryId;
                await CategotyService.editProductHolds(categoryId, '+');
            }
            catch (e) {
                throw Error("Category not existed");
            }
        }
        let productDocObj = {
            name: name, price: price, brand: brand,
            category: category, details: details, images: images,
            rates: [0, 0, 0, 0, 0],
        };
        return databaseServiceUtils.createDocument(Product,productDocObj);
    },

    // this can be update multi params sort but i am lazy
    fetchAllProduct: async (limit, sort, type) => {
        let sortedParams = {};
        if (type != 1 && type != -1) {
            type = -1;
        }
        if (sort) {
            sortedParams[sort] = type;
        }
        limit = isInt(limit) ? limit : null;
        const results = await Product.find().limit(limit).sort(sortedParams);
        return await Promise.all(results.map(async (product) => {
            let imageUrls = [];
            for (let i = 0; i < product.images.length; i++) {
                imageUrls.push(product.images[i].firebaseUrl);
            }
            let status = 'sold-out';
            if (product.inStock > 0) {
                status = 'in-stock';
            }
            let brand = null;
            try {
                brand = await BrandService.fetchBrand(product.brand);
            } catch (e) {
                console.log(e);
            }
            let category = null;
            try {
                category = await CategotyService.fetchCategory(product.category);
            }
            catch (e) {
                console.log(e);
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
                brand: brand,
                category: category,
                buyCount: product.buyCount,
                viewCount: product.viewCount
            };
        }));
    },

    // Mising edit product,category holds
    deleteAllProduct: async () => {
        databaseServiceUtils.deleteCollection(Product,true);
    },


    fetchProduct: async (id) => {
        try {
        const product = await Product.findById(mongoose.mongo.ObjectId(id));
        if(product === null) throw new Error(`Product ${id} is not found`);
        let imageUrls = [];
        for (let i = 0; i < product.images.length; i++) {
            imageUrls.push(product.images[i].firebaseUrl);
        }
        let status = 'sold-out';
        if (product.inStock > 0) {
            status = 'in-stock';
        }
        let brand = null;
        try {
            brand = await BrandService.fetchBrand(product.brand);
        } catch (e) {
            console.log(e);
        }
        let category = null;
        try {
            category = await CategotyService.fetchCategory(product.category);
        }
        catch (e) {
            console.log(e);
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
            brand: brand,
            category: category,
            buyCount: product.buyCount,
            viewCount: product.viewCount
        };
    } catch (e) {
        throw e;
    }
    },

    deleteProduct: async (id) => {
        databaseServiceUtils.deleteDocument(Product,id,true);
    },

    rateProduct: async (id, rate) => {
        if (!isInt(rate) && (rate < 1 || rate > 5)) {
            throw Error("Invalid rate");
        }
        const session = await Product.startSession();
        session.startTransaction();
        try {
            const product = await Product.findById(mongoose.Types.ObjectId(id)).session(session);
            if(product === null) throw new Error(`Product ${id} is not existed`);
            let rates = product.rates;
            rates[rate-1] =rates[rate-1]+1;
            let totalRates = 0;
            let totalStars = 0;
            let rateAverage = 0;
            for(let i = 0; i< 5; i++){
                totalRates+= rates[i];
                totalStars+= rates[i] * (i+1);
            }
            if(totalRates!=0){
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

    editProduct: async(id, name, price, brandId, categoryId, details, imageFiles)=>{
        // imageFiles undeinfed => not edit
        const session = await Product.startSession();
        session.startTransaction();
        try {
            const product = await Product.findById(mongoose.Types.ObjectId(id)).session(session);
            if(product === null) throw new Error(`Product ${id} is not found`);
            if(name){
                product.name = name;
            }
            if(price){
                product.price = price;
            }
            if(details){
                product.details = details;
            }
            if(brandId){
                try {
                    await BrandService.fetchBrand(brandId);
                    await BrandService.editProductHolds(brandId, '+');
                } catch (e) {
                    throw Error("Brand not existed");
                }
                if(product.brand){
                    await BrandService.editProductHolds(product.brand, '-');
                }
                product.brand = brandId;
            }

            if(categoryId){
                try {
                    await CategotyService.fetchCategory(categoryId);
                    await CategotyService.editProductHolds(categoryId, '+');
                }
                catch (e) {
                    throw Error("Category not existed");
                }
                if(product.category){
                    await CategotyService.editProductHolds(product.category, '-');
                }
                product.category = categoryId;
            }
            if(imageFiles!==undefined){
                let images = []
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