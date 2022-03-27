import { Router } from "express";
const testApiRouter = Router();
import { faker } from "@faker-js/faker";
import Category from "../../components/category/model.js";
import Brand from "../../components/brand/model.js";
import ImageService from "../../components/image/service.js";
import axios from "axios";
import {Image} from "../../components/image/model.js";
import Product from "../../components/product/model.js";
import { query, validationResult } from "express-validator";


testApiRouter.get("/", async (req, res) => {
  res.render("test");
});

testApiRouter.get("/gen-cat", async (req, res) => {
  for (let i = 0; i < 100; i++) {
    const cat = new Category({ name: faker.name.findName() });
    await cat.save();
  }
  res.status(200).send("gen completed");
});

// testApiRouter.get("/gen-brand", async (req, res) => {
//   for (let i = 0; i < 100; i++) {

    // const response = await axios.get(faker.image.business(),  { responseType: 'arraybuffer' })
    // let image = ImageService.createImage(response);
    // const brand = new Brand({ name: faker.name.findName(),images:[image] });
    
//     await brand.save();
//   }
//   res.status(200).send("gen completed");
// });

testApiRouter.get("/gen-product", async (req, res) => {
  const image = new Image({
    firebasePath: '/images/f7ab3e01-6872-4e48-b269-934abdefc3ac.png',
    firebaseUrl: 'https://firebasestorage.googleapis.com/v0/b/teche-commerce-a2c6a.appspot.com/o/images%2Ff7ab3e01-6872-4e48-b269-934abdefc3ac.png?alt=media&token=13e851d4-7412-494b-a1ad-9e40c33f8c4c'
  })
  for (let i = 0; i < 20; i++) {
    const product = new Product({name: faker.commerce.productName()
    ,price: faker.commerce.price()
    ,details: faker.lorem.paragraph()
    ,brand: '62400687ebaa123bc804353e'
    ,category: '623da62aa9ce18ef3a36659f'
    ,images: [image]
    ,});

    await product.save();
  }
  res.status(200).send("gen completed");
});


testApiRouter.get(
  "/get-cat",
  query("page")
    .if(query("page").exists())
    .isInt({ min: 1 })
    .withMessage("page must be interger in range 1-...")
    .toInt(),
  query("limit")
    .if(query("limit").exists())
    .isInt({ min: 1 })
    .withMessage("limit  must be interger in range 1-...")
    .toInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { page, limit, sort} = req.query;
    let orderBy;
    if(sort){
      orderBy = req.query.order_by;
      if(!orderBy){
        orderBy = 'desc';
      }
      if(!['desc', 'asc'].includes(orderBy)){
        return res.status(400).send("invalid sort params");
      }

      if(orderBy=='desc'){
        orderBy = -1;
      }else{
        orderBy = 1;
      }
    }

   
    // check isInt by express-validator => important
    // missing page or limit is fine

    const totalCount = await Category.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const categories = await Category.find()
      .skip(limit * page - limit)
      .limit(limit).sort({sort: orderBy});
    const result = {
      ...(limit && { "total-pages": totalPages }),
      ...(limit && { "current-page": page ? page: 1 }),
      "total-items": totalCount,
      "item-count": categories.length,
      "items": categories,
    };
    res.status(200).json(result);
  }
);


testApiRouter.get('/',async (req, res) => {
  res.render('test');
});

export default testApiRouter;


async function queryAll(res, req, model){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { page, limit, sort} = req.query;
  let orderBy;
  if(sort){
    orderBy = req.query.order_by;
    if(!orderBy){
      orderBy = 'desc';
    }
    if(!['desc', 'asc'].includes(orderBy)){
      return res.status(400).send("invalid sort params");
    }

    if(orderBy=='desc'){
      orderBy = -1;
    }else{
      orderBy = 1;
    }
  }

 
  // check isInt by express-validator => important
  // missing page or limit is fine

  const totalCount = await Category.countDocuments();
  const totalPages = Math.ceil(totalCount / limit);
  const categories = await Category.find()
    .skip(limit * page - limit)
    .limit(limit).sort({sort: orderBy});
  const result = {
    ...(limit && { "total-pages": totalPages }),
    ...(limit && { "current-page": page ? page: 1 }),
    "total-items": totalCount,
    "item-count": categories.length,
    "items": categories,
  };
  res.status(200).json(result);
}
