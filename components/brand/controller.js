import Brand from "./model.js";
import BrandService from "./service.js";
import CommonMiddleWares from "../common/middleware.js";
import CommomDatabaseServies from "../common/services.js";
import { body, validationResult } from "express-validator";

const BrandController = {
  createBrand: [
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
        const { brandName } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        let brandImg = [];
        if (req.files) {
          brandImg = req.files;
        }

        if (brandImg.length > 1) {
          return res.status(400).end("only 1 image for each brand");
        }
        if (brandImg.length == 1) {
          const type = brandImg[0].mimetype;
          if (!["image/png", "image/jpeg"].includes(type)) {
            return res.status(400).end("image must be of type png or jpeg");
          }
        }

        const id = await BrandService.createBrand(brandName, brandImg);
        res.status(201).end(`Brand created with id ${id}`);
      } catch (e) {
        console.log(e);
        res.status(402).end(`Can't create brand, something went wrong: ${e}`);
      }
    },
  ],
  fetchAllBrand: [
    CommonMiddleWares.apiQueryValidations,
    CommonMiddleWares.apiQueryParamsExtract,
    async (req, res) => {
      try {
        const { limit, page, sortParams, range } = req.params;
        const result = await CommomDatabaseServies.queryAllWithModel(
          Brand,
          BrandService,
          limit,
          page,
          sortParams,
          range
        );
        res.status(200).json(result);
      } catch (e) {
        console.log(e);
        res.status(404).end("Not Found");
      }
    },
  ],


  fetchBrand: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BrandService.fetchBrand(id);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.status(200).end(JSON.stringify(result));
    } catch (e) {
      console.log(e);
      res.status(404).end(e.message);
    }
  },

  deleteAllBrand: async (req, res) => {
    try {
      await BrandService.deleteAllBrand();
      res.status(200).end("All brands deleted");
    } catch (e) {
      console.log(e);
      res.status(404).end("Failed to delete some brands, try again");
    }
  },
  deleteBrand: async (req, res) => {
    try {
      const { id } = req.params;
      await BrandService.deleteBrand(id);
      res.status(200).end("Brand deleted");
    } catch (e) {
      console.log(e);
      res
        .status(404)
        .end("Can't delete brand, it's not exist or something went wrong");
    }
  },
  editBrand: async (req, res) => {
    try {
      const { brandName } = req.body;
      const { id } = req.params;
      let brandImages = undefined;
      if (req.files.length > 0) {
        console.log(req.files);
        brandImages = req.files;
      }
      await BrandService.editBrand(id, brandName, brandImages);
      res.status(200).end("brand successfully edit");
    } catch (e) {
      console.log(e);
      res.status(404);
    }
  },
};

export default BrandController;
