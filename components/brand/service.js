import ImageService from '../image/service.js';
import Brand from './model.js'
import mongoose from 'mongoose';
import isInt from '../../utils/is_int.js';
import { async } from '@firebase/util';

const BrandService = {
    createBrand: async (name, img) => {
        // name: <String> Sname of the brand
        // img: <File> object represent the file

        let imageModel = null;
        if (img) {
            imageModel = await ImageService.createImage(img);
        }
        let brand = new Brand({ name: name, image: imageModel });
        await brand.save();
        console.log("Brand created");
        return brand.id;
    },

    fetchAllBrand: async (limit, sort, type) => {
        let sortedParams = {};
        if (type != 1 && type != -1) {
            type = -1;
        }
        if (sort) {
            sortedParams[sort] = type;
        }
        limit = isInt(limit) ? limit : null;
        const results = await Brand.find().limit(limit).sort(sortedParams);
        return results.map((brand) => {
            let img = brand.image;
            let imgUrl = null
            if (img) {
                imgUrl = img.firebaseUrl;
            }
            return {
                id: brand.id,
                name: brand.name,
                imageUrl: imgUrl,
                rankingPoints: brand.rankingPoints,
                productsHold: brand.productsHold,
            }
        });
    },

    deleteAllBrand: async () => {
        const brands = await Brand.find();
        await Promise.all(brands.map(async (brand) => {
            let brandImg = brand.image;
            if (brandImg) {
                await ImageService.deleteImage(brandImg.firebasePath);
            }
            await Brand.findByIdAndDelete(brand.id);
        }));
    },

    fetchBrand: async (id) => {
        try {
        const brand = await Brand.findById(mongoose.mongo.ObjectId(id));
        if(brand === null) {
            throw new Error(`Brand ${id} is not existed`);
        }
        let brandImg = brand.image;
        let imgLink = null;
        if (brandImg) {
            imgLink = brandImg.firebaseUrl;
        }
        return {
            id: brand.id,
            name: brand.name,
            imageUrl: imgLink,
            rankingPoints: brand.rankingPoints,
            productsHold: brand.productsHold,
        }
    }catch (e) {
        throw e;
    }
    },

    deleteBrand: async (id) => {
        try {
        const brand = await Brand.findById(mongoose.Types.ObjectId(id));
        if(brand === null) {
            throw new Error(`Brand ${id} is not existed`);
        }
        let brandImg = brand.image;
        if (brandImg) {
            await ImageService.deleteImage(brandImg.firebasePath);
        }
        await Brand.findByIdAndDelete(brand.id);
    }
    catch (e) {
        throw e;
    }
    },

    editProductHolds: async (id, op) => {
        // editProductHolds(id, '+') => plus 1
        const session = await Brand.startSession();
        session.startTransaction();
        try {
            const brand = await Brand.findById(mongoose.Types.ObjectId(id)).session(session);
            if(brand === null) {
                throw new Error(`Brand ${id} is not existed`);
            }
            if (!op){
                throw Error("operation not specifief");
            }
            if(op=='+'){
                brand.productsHold = brand.productsHold + 1;

            }else if(op=='-'){
                brand.productsHold = brand.productsHold - 1;
            }else{
                throw Error("operation invalid");
            }
            await brand.save();
            await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally{
            await session.endSession();
        }
    },
    editrankingPoints: async (id, op) => {
        // editrankingPoints(id, '+') => plus 1
        const session = await Brand.startSession();
        session.startTransaction();
        try {
            const brand = await Brand.findById(mongoose.Types.ObjectId(id)).session(session);
            if(brand === null) {
                throw new Error(`Brand ${id} is not existed`);
            }
            if (!op){
                throw Error("operation not specifief");
            }
            if(op=='+'){
                brand.rankingPoints = brand.rankingPoints + 1;

            }else if(op=='-'){
                brand.rankingPoints = brand.rankingPoints - 1;
            }else{
                throw Error("operation invalid");
            }
            await brand.save();
            await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally{
            await session.endSession();
        }
    },

    editBrand: async (id, name, image)=>{
        // image undefined => not change
        // image null => delete brand Image
        const session = await Brand.startSession();
        session.startTransaction();
        try {
            const brand = await Brand.findById(mongoose.Types.ObjectId(id)).session(session);
            if(brand === null) {
                throw new Error(`Brand ${id} is not existed`);
            }
            if(name){
                brand.name=name;
            }
            if(image!==undefined){
                if(brand.image){
                    await ImageService.deleteImage(brand.image.firebasePath);
                    brand.image = null;
                }
                if(image){
                    const newImg = await ImageService.createImage(image);
                    brand.image = newImg;
                }
            }
            await brand.save();
            await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally{
            await session.endSession();
        }
    },
};


export default BrandService;