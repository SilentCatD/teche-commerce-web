import express from "express";

const router = new express.Router();

router.get('/', async (req, res)=>{
    res.render("admin-controller");
});

export {router};