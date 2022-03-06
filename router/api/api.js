import express from "express";
import { router as v1 } from "./v1/v1.js";

const router = express.Router()

router.use('/v1', v1)

export {router};