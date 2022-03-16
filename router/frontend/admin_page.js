import express from "express";

const router = new express.Router();

router.get('/', async (req, res)=>{
    res.send("../../public/admin/index.html");
});

export {router};