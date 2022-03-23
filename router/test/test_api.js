import {Router} from 'express';

const testApiRouter = Router();

testApiRouter.get('/', async (req, res) => {
    res.render('test');
});

export default testApiRouter;