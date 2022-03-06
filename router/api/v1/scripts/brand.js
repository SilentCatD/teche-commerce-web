import express from "express";
import multer from "multer";
import {createBrand, fetchAllBranch} from '../../../../controller/brand.js';
const router = express.Router();
const upload = multer();
// /api/v1/brand

router.get('/', async (req, res)=>{
    const result = await fetchAllBranch();
    res.send(result);
});

router.post('/', upload.single('brandImg'), async (req, res)=> {
    const {brandName} = req.body;
    let brandImg;
    if (req.file){
        brandImg = req.file;
    }
    try{
        const id = await createBrand(brandName, brandImg);
        res.status(201).end(`Brand created with id ${id}`); 
    } catch (e){
        res.status(402).end(`Can't create brand, something went wrong: ${e}`);
        throw e;
    }
});


export {router};