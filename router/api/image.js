import express from "express";
import {getImgStream} from '../../controller/images.js';

const router = express.Router();

router.get('/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        let imgStream = await getImgStream(id);
        imgStream.pipe(res);
    }
    catch (e){
        res.status(404).end("Image not found");
    }
});


export {router};