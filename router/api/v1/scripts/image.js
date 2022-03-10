import express from "express";
import ImageController from "../../../../controller/images.js";

const imageRouter = express.Router();

imageRouter.route("/:id").get(ImageController.getImgStream);

export default imageRouter;
