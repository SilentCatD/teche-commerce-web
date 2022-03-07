
import {Readable} from 'stream'; 
import mongoose from "mongoose";
import Brand from "../../model/brand.js";
import {randomBytes} from 'crypto';

 class MongoDBDatabase {
    #gridFSBucket
    #connectStatus = false;

    async connect(){
        if (this.#connectStatus) {
            return;
        }
        try{
            await mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@thisisfortestpurpose.3mdrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true,});
            console.log("Database connected");
            
            this.#connectStatus = true;
            this.#gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'images'
            });

        }
        catch (e){
            console.log(e);
            throw Error("Failed to connect to database");
        }
    }

    async createBrand(name, img){
        function generateFileNames(){
            let token;
            randomBytes(48, (err, buffer)=>{
                token= buffer.toString();
            });
            return token;
        }
        try{
            let imgId=null;
            if (img){
                let fileName = generateFileNames();
                let writeStream = this.#gridFSBucket.openUploadStream(
                    fileName, 
                    {
                     metadata: {field: 'mime-type', value: img.mimetype}
                    }
                 );
                 imgId = writeStream.id;
                 let readStream = Readable.from(img.buffer);
                 readStream.pipe(writeStream);
            }
             
             let brand = new Brand({name: name, imageObjectId: imgId});
             await brand.save();
             console.log("Brand created");
             return brand.id;
        } catch (e){
            console.log(e);
            throw Error("Failed to create brand");
        }
    }


    async fetchImageFileStream(imgId){
        try{
            const imgFile = await this.#gridFSBucket.find({_id: mongoose.Types.ObjectId(imgId)}).count();
            if (imgFile){
                const imgStream = this.#gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(imgId));
                return imgStream;
            }
            throw Error("Image not found");
            // return imgStream;
        }
        catch (e) {
            console.log(e);
            throw Error("Failed to delete image");
        }
    }

    async fetchAllBrand(){
        const results = await Brand.find();
        return results.map((brand)=> {
            let imgId = brand.imageObjectId;
            let imgUrl = null
            if (imgId){
                imgUrl = `${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}/api/v1/image/${imgId}`
            }
            return {
            id: brand.id,
            name: brand.name,
            imageUrl: imgUrl
        }});
    }

    async deleteAllBrand(){
        const brands = await Brand.find();
        try{
            brands.map(async (brand)=>{
                let brandImg = brand.imageObjectId;
                if (brandImg){
                    await this.#gridFSBucket.delete(brandImg);
                }
                await Brand.findByIdAndDelete(brand.id);
            });
        }
        catch (e){
            console.log(e);
            throw Error("Failed to delete all brands");
        }
    }

    async fetchBrand(id){
        try{
            const brand = await Brand.findById(mongoose.mongo.ObjectId(id));
            if(!brand){
                throw Error("Brand not exist");
            }
            let brandImg = brand.imageObjectId;
            let imgLink=null;
            if (brandImg){
                imgLink = `${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}/api/v1/image/${brand.imageObjectId}`;
            }
            return {
                id: brand.id,
                name: brand.name,
                imageUrl: imgLink
            }
        }catch (e){
            console.log(e);
            throw Error("Failed to fetch brand");
        }
    }

    async deleteBrand(id){
        try{
            const brand = await Brand.findById(mongoose.Types.ObjectId(id));
            if(!brand){
                throw Error("Brand not exist");
            }
            let brandImg = brand.imageObjectId;
            if (brandImg){
                await this.#gridFSBucket.delete(brandImg);
            }
            await Brand.deleteOne({_id: brand.id});

        } catch (e){
            console.log(e);
            throw Error("Failed to delete brand");
        }        
    }
}


export {MongoDBDatabase};

