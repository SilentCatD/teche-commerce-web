import express from "express";
import authorizeJwt from "../../middleware/authJwt.js";
const router = new express.Router();

router.get('/',authorizeJwt.verifyToken, async (req, res)=>{
  // Authentication
  res.status(200).send("LOGIN FORM NOT IMPLEMENT YET");

});

export {router};