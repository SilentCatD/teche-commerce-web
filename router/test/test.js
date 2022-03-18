import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../database/scripts/firebase_config.js";
import { Router } from "express";
import __dirname from "../../dirname.js";
import { readFile } from "fs/promises";
import {v4 as uuidv4} from 'uuid';
const testRouter = Router();

testRouter.use('/', async (req, res)=>{
    const originFileName = 'this_is_file_name.jpg'
    const fileExt = originFileName.split('.').pop();
    const storageRef = ref(storage, `/images/${uuidv4()+fileExt}`);
    const metadata = {
        contentType: 'image/jpeg',
      };
    const data = await readFile(__dirname + '/router/test/test_img.jpg');
    const result = await uploadBytes(storageRef, data, metadata);
    const url = await getDownloadURL(result.ref);
    res.end(url);
});

export default testRouter;