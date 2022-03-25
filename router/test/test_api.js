import {Router} from 'express';
import {} from 'faker';
const testApiRouter = Router();
import {faker} from '@faker-js/faker';
import Category from '../../components/category/model.js';
import isInt from '../../utils/is_int.js';
testApiRouter.get('/', async (req, res) => {
    res.render('test');
});

testApiRouter.get('/gen-cat', async (req, res)=>{
    for(let i = 0 ; i < 100; i++){
        const cat =  new Category({name: faker.name.findName()});
        await cat.save();
    }
    res.status(200).send('gen completed');
});


testApiRouter.get('/get-cat/', async (req, res)=>{
    const {page, limit} = req.query;
    // check isInt by express-validator
    if (page<1){
        return res.status(404).send('invalid page request');
    }
    const totalCount = await Category.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const categories = await Category.find().skip((limit * page) - limit).limit(limit);
    const result = {
        ...(limit && {'total-pages': totalPages}),
        ...(limit && {'current-page': page ? parseInt(page): 1}),
        'item-count': categories.length,
        'items': categories,
    };
    res.status(200).json(result);
});



export default testApiRouter;