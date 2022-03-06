
import {Readable} from 'stream'; 
import mongoose from "mongoose";
import Brand from "../../model/brand.js";
import {randomBytes} from 'crypto';
import {createWriteStream} from 'fs';

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
            console.log(`Failed to connect to database: ${e}`);
            throw e;
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
            let writeStream = this.#gridFSBucket.openUploadStream(
                generateFileNames,
                {
                 metadata: {field: 'mime-type', value: img.mimetype}
                }
             );
             let readStream = Readable.from(img.buffer);
             readStream.pipe(writeStream);
             
             let brand = new Brand({name: name, imageObjectId: writeStream.id});
             await brand.save();
             console.log("Brand created");
             return writeStream.id;
        } catch (e){
            console.log(e);
            throw e;
        }
    }


    async fetchImageFileStream(imgId){
        return this.#gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(imgId));
    }

    async fetchAllBrand(){
        const results = await Brand.find();
        return results.map((brand)=> {return {
            id: brand.id,
            name: brand.name,
            imageUrl: `${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}/api/v1/image/${brand.imageObjectId}`
        }});
    }
}


export {MongoDBDatabase};

