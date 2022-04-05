import { query, validationResult, body } from "express-validator";
import Brand from "../brand/model.js";
import Category from "../category/model.js";
import User from "../user/model.js";

const apiQueryValidations = [
  query("page")
    .if(query("page").exists())
    .trim()
    .isInt({ min: 1 })
    .withMessage("page must be interger in range 1-...")
    .toInt(),
  query("limit")
    .if(query("limit").exists())
    .trim()

    .isInt({ min: 1 })
    .withMessage("limit  must be interger in range 1-...")
    .toInt(),
  query("min")
    .if(query("min").exists())
    .if(query("range_field").exists())
    .trim()

    .isInt()
    .withMessage("min value must be interger")
    .toInt(),
  query("max")
    .if(query("max").exists())
    .if(query("range_field").exists())
    .trim()

    .isInt()
    .withMessage("max value must be interger")
    .toInt(),
];

const CommonMiddleWares = {
  productCreateAndEditValidations: [
    body("productName")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be emtpy")
      .bail()
      .trim()
      .isByteLength({ min: 3, max: 50 })
      .withMessage("character of field must be in range 3-50")
      .trim(),
    body("productPrice")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isNumeric()
      .withMessage("field must be numeric value")
      .toFloat(),
    body("productUnit")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isInt()
      .withMessage("field must be integer")
      .toInt(),
    body("productBrand")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (id) => {
        const exist = await Brand.exists({ _id: id });
        if (!exist) {
          throw new Error("brand not exist");
        }
        return true;
      }),
    body("productCategory")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .custom(async (id) => {
        const exist = await Category.exists({ _id: id });
        if (!exist) {
          throw new Error("category not exist");
        }
        return true;
      }),
  ],

  apiQueryParamsExtract: [
    apiQueryValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, msg: errors.array()[0].msg });
      }
      const { page, limit, sort, range_field, min, max } = req.query;
      if (sort) {
        let order_by = req.query.order_by;
        let sortParams = {};
        if (!order_by) {
          order_by = "desc";
        }
        if (!["desc", "asc"].includes(order_by)) {
          return res
            .status(400)
            .send({ success: false, msg: "invalid sort params" });
        }

        if (order_by == "desc") {
          order_by = -1;
        } else {
          order_by = 1;
        }
        sortParams[sort] = order_by;

        req.params.sortParams = sortParams;
      }
      if (range_field) {
        let range = {};
        range[range_field] = {
          ...(min !== null && min !== undefined && { $gte: min }),
          ...(max !== null && max !== undefined && { $lte: max }),
        };
        req.params.range = range;
      }
      req.params.page = page;
      req.params.limit = limit;
      next();
    },
  ],

  accountRegisterRequirement: [
    body("email")
      .exists()
      .notEmpty()
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isEmail()
      .withMessage("invalid email format")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ email: email });
        if (user) {
          throw new Error("email already registerd");
        }
        return true;
      }),
    body("name")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isByteLength({ min: 3, max: 20 })
      .withMessage("Name must in range [3, 20] Character"),
    body("password")
      .exists()
      .bail()
      .notEmpty({ ignore_whitespace: true })
      .withMessage("field can't be empty")
      .bail()
      .trim()
      .isStrongPassword({ minSymbols: 0 })
      .withMessage("password not strong enough"),
  ],
};

export default CommonMiddleWares;
