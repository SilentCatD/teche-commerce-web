import BrandService from "../brand/service.js";
import CategotyService from "../category/service.js";
import ImageService from "../image/service.js";
import Product from "./model.js";

const ProductService ={
    createProduct: async(name, price, brandId, categoryId, details, imageFiles) =>{
        let images = []
        for (let i = 0; i < imageFiles.length; i++) {
            let imageModel = await ImageService.createImage(imageFiles[i]);
            images.push(imageModel);
        }
        let brand = null;
        if(brandId){
            try{
                await BrandService.fetchBrand(brandId);
                brand = brandId;
            } catch (e){
                throw Error("Brand not existed");
            }
        }
        let category = null;
        if(categoryId){
            try{
                await CategotyService.fetchCategory(categoryId);
                category = categoryId;
            }
            catch (e){
                throw Error("Category not existed");
            }
        }
        let product = new Product({
            name: name, price: price, brand: brand,
            category: category, details: details, images: images,
            rates: [0, 0, 0, 0, 0],
        });

        await product.save();
        console.log("Product created");
        return product.id;
    }

    // this can be update multi params sort but i am lazy
    async fetchAllProduct(limit, sort, type) {
        let sortedParams = {};
        if (type != 1 && type != -1) {
            type = -1;
        }
        if (sort) {
            sortedParams[sort] = type;
        }
        limit = isInt(limit) ? limit : null;
        const results = await Product.find().limit(limit).sort(sortedParams);
        return await Promise.all(results.map( async (product) => {
            let imageUrls = [];
            for (let i = 0; i < product.images.length; i++) {
                imageUrls.push(this.#fetchImageURL(product.images[i]));
            }
            let status = 'sold-out';
            if(product.inStock > 0){
                status = 'in-stock';
            }
            let brand = null;
            try{
                brand = await this.fetchBrand(product.brand);
            } catch (e){
                console.log(e);
            }
            let category = null;
            try{
                category = await this.fetchCategory(product.category);
            }
            catch (e){
                console.log(e);
            }
            let rateSum = 0;
            product.rates.forEach((element, index) => {
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
                status : status,
                brand: brand,
                category: category,
                buyCount: product.buyCount,
                viewCount: product.viewCount
            };
        }));
    }

    async deleteAllProduct() {
        const products = await Product.find();
        await Promise.all(products.map(async (product) => {
            let imagesUrls = product.images; 
            for (let i = 0; i < imagesUrls.length; i++) {
                await this.#deleteImg(imagesUrls[i]);
            }
        }));
        await Product.deleteMany();
    }


    async fetchProduct(id) {
        const product = await Product.findById(mongoose.mongo.ObjectId(id));
        let imageUrls = [];
        for (let i = 0; i < product.images.length; i++) {
            imageUrls.push(this.#fetchImageURL(product.images[i]));
        }
        let status = 'sold-out';
        if(product.inStock > 0){
            status = 'in-stock';
        }
        let brand = null;
        try{
            brand = await this.fetchBrand(product.brand);
        } catch (e){
            console.log(e);
        }
        let category = null;
        try{
            category = await this.fetchCategory(product.category);
        }
        catch (e){
            console.log(e);
        }
        let rateSum = 0;
        product.rates.forEach((element, index) => {
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
            status : status,
            brand: brand,
            category: category,
            buyCount: product.buyCount,
            viewCount: product.viewCount
        };
    }

    async deleteProduct(id) {
        const product = await Product.findById(mongoose.Types.ObjectId(id));
        let imageIds = product.images;
        for (let i = 0; i < imageIds.length; i++) {
            await this.#deleteImg(imageIds[i]);
        }
        await Product.deleteOne({ _id: product.id });
    }
};