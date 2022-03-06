import express from "express";
import { router as brand } from "./scripts/brand.js";
import { router as img } from "./scripts/image.js";

const router = express.Router();

router.use('/brand', brand);
router.use('/image', img);

export {router};