
import { Readable } from 'stream';
import mongoose from "mongoose";
import Brand from "../../model/brand.js";
import Category from "../../model/category.js";
import { randomBytes } from 'crypto';

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

class MongoDBDatabase {
    #gridFSBucket
    #connectStatus = false;

    async connect() {
        if (this.#connectStatus) {
            return;
        }
        try {
            await mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@thisisfortestpurpose.3mdrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true, });
            console.log("Database connected");

            this.#connectStatus = true;
            this.#gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'images'
            });

        }
        catch (e) {
            console.log(e);
            throw Error("Failed to connect to database");
        }
    }

    async #upLoadImg(img) {
        function generateFileNames() {
            return randomBytes(48).toString();
        }
        let fileName = generateFileNames();
        let writeStream = this.#gridFSBucket.openUploadStream(
            fileName,
            {
                metadata: { field: 'mime-type', value: img.mimetype }
            }
        );
        let readStream = Readable.from(img.buffer);
        readStream.pipe(writeStream);
        return writeStream.id;
    }

    async #deleteImg(id) {
        await this.#gridFSBucket.delete(id);
    }

    async createBrand(name, img) {
        function generateFileNames() {
            let token;
            randomBytes(48, (err, buffer) => {
                token = buffer.toString('hex');
            });
            return token;
        }
        let imgId = null;
        if (img) {
            imgId = await this.#upLoadImg(img);
        }
        let brand = new Brand({ name: name, imageObjectId: imgId });
        await brand.save();
        console.log("Brand created");
        return brand.id;
    }


    async fetchImageFileStream(imgId) {
        const imgFile = await this.#gridFSBucket.find({ _id: mongoose.Types.ObjectId(imgId) }).count();
        if (imgFile) {
            const imgStream = this.#gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(imgId));
            return imgStream;
        }
        throw Error(`Cant locate image with id: ${imgId}`);
    }


    async fetchAllBrand(limit, sort, type) {
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
            let imgId = brand.imageObjectId;
            let imgUrl = null
            if (imgId) {
                imgUrl = `${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}/api/v1/image/${imgId}`
            }
            return {
                id: brand.id,
                name: brand.name,
                imageUrl: imgUrl,
                rankingPoints: brand.rankingPoints,
            }
        });
    }

    async deleteAllBrand() {
        const brands = await Brand.find();
        brands.map(async (brand) => {
            let brandImg = brand.imageObjectId;
            if (brandImg) {
                await this.#deleteImg(brandImg);
            }
            await Brand.findByIdAndDelete(brand.id);
        });
    }

    async fetchBrand(id) {
        const brand = await Brand.findById(mongoose.mongo.ObjectId(id));
        let brandImg = brand.imageObjectId;
        let imgLink = null;
        if (brandImg) {
            imgLink = `${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}/api/v1/image/${brand.imageObjectId}`;
        }
        return {
            id: brand.id,
            name: brand.name,
            imageUrl: imgLink
        }
    }

    async deleteBrand(id) {
        const brand = await Brand.findById(mongoose.Types.ObjectId(id));
        let brandImg = brand.imageObjectId;
        if (brandImg) {
            await this.#deleteImg(brandImg);
        }
        await Brand.deleteOne({ _id: brand.id });
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
        limit = this.isInt(limit) ? limit : null;
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
}

export default MongoDBDatabase;
