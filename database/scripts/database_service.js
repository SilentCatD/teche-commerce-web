
import mongoose from "mongoose";
import Category from "../../model/category.js";
import Product from "../../model/product.js";
import { v4 as uuidv4 } from 'uuid';
import {storage} from './firebase_config.js'
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

class Database {
    #connectStatus = false;

    async connect() {
        if (this.#connectStatus) {
            return;
        }
        try {
            await mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@thisisfortestpurpose.3mdrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true, });
            console.log("Database connected");
            this.#connectStatus = true;
        }
        catch (e) {
            console.log(e);
            throw Error("Failed to connect to database");
        }
    }

    async upLoadImg(file) {
        // file<File>: image file to upload
        // return firebase path and file download url
        const fileExt = file.name.split('.').pop();
        const firebasePath = `/images/${uuidv4()+fileExt}`;
        const storageRef = ref(storage, firebasePath);
        const metadata = {
            contentType: file.type,
          };
        const result = await uploadBytes(storageRef, data, metadata);
        const url = await getDownloadURL(result.ref);
        return {
            firebasePath: firebasePath,
            firebaseUrl: url,
        };
    }

    async deleteImg(firebasePath) {
        // firebasePath<String>: path to file in firebase
        const fileRef = ref(storage, firebasePath);
        await deleteObject(fileRef);
    }

    async createCategory(name) {
        let category = new Category({ name: name });
        await category.save();
        console.log("Category created");
        return category.id;
    }

    async fetchAllCategory(limit, sort, type) {
        let sortedParams = {};
        if (type != 1 && type != -1) {
            type = -1;
        }
        if (sort) {
            sortedParams[sort] = type;
        }
        limit = isInt(limit) ? limit : null;
        const results = await Category.find().limit(limit).sort(sortedParams);
        return results.map((category) => {
            return {
                id: category.id,
                name: category.name
            }
        });
    }

    async deleteAllCategory() {
        await Category.deleteMany({});
    }

    async fetchCategory(id) {
        const category = await Category.findById(mongoose.mongo.ObjectId(id));
        return {
            id: category.id,
            name: category.name
        }
    }

    async deleteCategory(id) {
        const category = await Category.findById(mongoose.Types.ObjectId(id));
        await Category.deleteOne({ _id: category.id });

    }

    // Product section
    async createProduct(name, price, brandId, categoryId, details, images) {
        let imageIds = []
        for (let i = 0; i < images.length; i++) {
            let imgId = await this.upLoadImg(images[i]);
            imageIds.push(imgId);
        }
        let brand = null;
        if(brandId){
            try{
                await this.fetchBrand(brandId);
                brand = brandId;
            } catch (e){
                throw Error("Brand not existed");
            }
        }
        let category = null;
        if(categoryId){
            try{
                await this.fetchCategory(categoryId);
                category = categoryId;
            }
            catch (e){
                throw Error("Category not existed");
            }
        }
        let product = new Product({
            name: name, price: price, brand: brand,
            category: category, details: details, images: imageIds,
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
                imageUrls.push(this.fetchImageURL(product.images[i]));
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
                await this.deleteImg(imagesUrls[i]);
            }
        }));
        await Product.deleteMany();
    }


    async fetchProduct(id) {
        const product = await Product.findById(mongoose.mongo.ObjectId(id));
        let imageUrls = [];
        for (let i = 0; i < product.images.length; i++) {
            imageUrls.push(this.fetchImageURL(product.images[i]));
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
            await this.deleteImg(imageIds[i]);
        }
        await Product.deleteOne({ _id: product.id });
    }
}

export default Database;
