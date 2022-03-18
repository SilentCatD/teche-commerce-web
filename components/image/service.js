import database from "../../database/database.js";
import Image from "../image.js";


const ImageService = {
    createImage: async(file)=>{
        // file <File>: file object need to upload
        // return id of Image Schema
        const result = await database.instance.upLoadImg(file);
        const {firebasePath, firebaseUrl} = result;
        const image = new Image({firebasePath: firebasePath, firebaseUrl: firebaseUrl});
        return image;
    },
    deleteImage: async(imgPath)=>{
        await database.instance.deleteImg(imgPath);
    },
};


export default ImageService;