import ImageService from '../image/service.js';
import Brand from './model.js'
import mongoose from 'mongoose';
import isInt from '../../utils/is_int.js';

const BrandService = {
    createBrand: async (name, img)=>{
        // name: <String> Sname of the brand
        // img: <File> object represent the file

        let imageModel = null;
        if (img) {
            imageModel = await ImageService.createImage(img);
        }
        let brand = new Brand({ name: name, image: imageModel});
        await brand.save();
        console.log("Brand created");
        return brand.id;
    },

    fetchAllBrand : async (limit, sort, type)=> {
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

    deleteAllBrand: async() => {
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
        const brand = await Brand.findById(mongoose.mongo.ObjectId(id));
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
    },

    deleteBrand: async (id) => {
        const brand = await Brand.findById(mongoose.Types.ObjectId(id));
        let brandImg = brand.image;
        if (brandImg) {
            await ImageService.deleteImage(brandImg.firebasePath);
        }
        await Brand.findByIdAndDelete(brand.id);
    },
};


export default BrandService;