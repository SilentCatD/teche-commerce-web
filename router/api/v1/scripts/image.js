import express from "express";
import { getImgStream } from "../../../../controller/images.js";

const router = express.Router();

router.route("/:id").get(getImgStream);

export { router };
