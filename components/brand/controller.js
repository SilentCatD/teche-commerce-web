import Brand from "./model.js";
import BrandService from "./service.js";
import CommonMiddleWares from "../common/middleware.js";
import { body, validationResult, param } from "express-validator";
import AuthorizationController from "../authorization/controller.js";

const BrandController = {
  createBrand: [
    AuthorizationController.isAdmin,
    body("brandName")
      .exists()
      .bail()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("field can't be emtpy")
      .bail()
      .isByteLength({ min: 3, max: 50 })
      .withMessage("character of field must be in range 3-50")
      .trim(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }
        const { brandName } = req.body;
        let brandImg = [];
        if (req.files) {
          brandImg = req.files;
        }

        if (brandImg.length > 1) {
          return res
            .status(400)
            .json({ success: false, msg: "only 1 image for each brand" });
        }
        if (brandImg.length == 1) {
          const type = brandImg[0].mimetype;
          if (!["image/png", "image/jpeg"].includes(type)) {
            return res.status(400).json({
              success: false,
              msg: "image must be of type png or jpeg",
            });
          }
          brandImg = brandImg[0];
        }

        const id = await BrandService.createBrand(brandName, brandImg);
        res
          .status(201)
          .json({ success: true, msg: `brand created with id ${id}` });
      } catch (e) {
        console.log(e);
        res.status(500).json({
          success: false,
          msg: `Can't create brand, something went wrong: ${e}`,
        });
      }
    },
  ],
  fetchAllBrand: [
    CommonMiddleWares.apiQueryParamsExtract,
    async (req, res) => {
      try {
        const { limit, page, sortParams, range, query } = req.query;
        const result = await BrandService.brandQueryAll(range, limit, page, sortParams, query);
        res.status(200).json({ success: true, data: result });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],

  fetchBrand: [
    param("id")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (productId) => {
        const exist = await Brand.exists({ _id: productId });
        if (!exist) {
          throw new Error("brand not existed");
        }
        return true;
      }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }
        const { id } = req.params;
        const result = await BrandService.fetchBrand(id);
        res.status(200).json({success: true, data: result});
      } catch (e) {
        console.log(e);
        res.status(500).json({success: false, msg: `something went wrong ${e}`});
      }
    },
  ],

  deleteAllBrand: [
    AuthorizationController.isAdmin,
    async (req, res) => {
      try {
        await BrandService.deleteAllBrand();
        res.status(200).end("All brands deleted");
      } catch (e) {
        console.log(e);
        res.status(404).end("Failed to delete some brands, try again");
      }
    },
  ],
  deleteBrand: [
    AuthorizationController.isAdmin,
    param("id")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (productId) => {
        const exist = await Brand.exists({ _id: productId });
        if (!exist) {
          throw new Error("brand not existed");
        }
        return true;
      }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ success: false, msg: errors.array()[0].msg });
        }
        const { id } = req.params;
        await BrandService.deleteBrand(id);
        res.status(200).json({ success: true, msg: "brand deleted" });
      } catch (e) {
        console.log(e);
        res
          .status(500)
          .json({ success: false, msg: `something went wrong ${e}` });
      }
    },
  ],
  editBrand: [
    async (req, res) => {
      try {
        const { brandName } = req.body;
        const { id } = req.params;
        let brandImages = undefined;
        if (req.files.length > 0) {
          brandImages = req.files;
        }
        await BrandService.editBrand(id, brandName, brandImages);
        res.status(200).end("brand successfully edit");
      } catch (e) {
        console.log(e);
        res.status(404);
      }
    },
  ],
};

export default BrandController;
