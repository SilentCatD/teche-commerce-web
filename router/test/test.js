import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../database/scripts/firebase_config.js";
import { Router } from "express";
import __dirname from "../../dirname.js";
import { readFile } from "fs/promises";
import {v4 as uuidv4} from 'uuid';
const testRouter = Router();

testRouter.use('/', async (req, res)=>{
   res.render('test');
});

export default testRouter;