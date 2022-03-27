import ImageService from '../image/service.js';
import Brand from './model.js'
import mongoose from 'mongoose';
import CommomDatabaseServies from "../common/services.js";
import { body, validationResult } from "express-validator";


const BrandService = {
    createBrand: async (name, img) => {
        // name: <String> Sname of the brand
        // img: <File> object represent the file
        let brandImg = []
        for (let i = 0; i < img.length; i++) {
            let imageModel = await ImageService.createImage(img[i]);
            brandImg.push(imageModel);
        }
        let brandDocObject = {name: name,images: brandImg};
        return CommomDatabaseServies.createDocument(Brand,brandDocObject);
    },

    deleteAllBrand: async () => {
        CommomDatabaseServies.deleteCollection(Brand,true);
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
        CommomDatabaseServies.deleteDocument(Brand,id,true);
    },

    editProductHolds: async (id, op) => {
        // editProductHolds(id, '+') => plus 1
        CommomDatabaseServies.editProductHolds(Brand,id,op);
    },
    editrankingPoints: async (id, op) => {
        // editrankingPoints(id, '+') => plus 1
        CommomDatabaseServies.editRankingPoints(Brand,id,op);
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