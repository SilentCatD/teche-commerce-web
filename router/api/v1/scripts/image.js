import express from "express";
import {
  ImageController
} from "../../../../controller/images.js";

const router = express.Router();

router.route("/:id").get(ImageController.getImgStream);

export {
  router
};
