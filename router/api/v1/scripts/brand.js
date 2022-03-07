import express from "express";
import multer from "multer";
import {createBrand, fetchAllBrand, deleteAllBrand, deleteBrand, fetchBrand} from '../../../../controller/brand.js';
const router = express.Router();
const upload = multer();
// /api/v1/brand

router.get('/', async (req, res)=>{
    const result = await fetchAllBrand();
    res.send(result);
});

router.get('/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        const result = await fetchBrand(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.status(200).end(JSON.stringify(result));
    }
    catch(e){
        console.log(e);
        res.status(404).end("Brand not exist");
    }
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
    }
});

router.delete('/', async (req, res)=>{
    try{
        await deleteAllBrand();
        res.status(200).send("All brands deleted");
    }
    catch (e){
        res.status(404).end("Failed to delete some brands, try again");
    }
});

router.delete('/:id', async (req, res)=>{
    try{
        const  {id} = req.params;
        await deleteBrand(id);
        res.status(200).end("Brand deleted");
    }catch (e){
        res.status(404).end("Can't delete brand, it's not exist or something went wrong");
    }
});

export {router};