import { query , validationResult} from 'express-validator';

const CommonMiddleWares = {
    apiQueryValidations: [
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
        query('min')
            .if(query("min").exists())
            .if(query('range_field').exists())
            .isInt()
            .withMessage('min value must be interger')
            .toInt(),
        query('max')
            .if(query("max").exists())
            .if(query('range_field').exists())
            .isInt()
            .withMessage('max value must be interger')
            .toInt()
    ],
    apiQueryParamsExtract: async (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { page, limit, sort, range_field, min, max} = req.query;
        if (sort) {
            let order_by = req.query.order_by;
            let sortParams = {};
            if (!order_by) {
                order_by = 'desc';
            }
            if (!['desc', 'asc'].includes(order_by)) {
                return res.status(400).send("invalid sort params");
            }
    
            if (order_by == 'desc') {
                order_by = -1;
            } else {
                order_by = 1;
            }
            sortParams[sort] = order_by;
    
            req.params.sortParams = sortParams;
        }
        if(range_field){
            let range = {};
            range[range_field] = { ...(min!==null&& min!==undefined) && {$gte: min}, ...(max!==null && max!==undefined) &&{$lte: max}};
            req.params.range =range;
        }
        req.params.page = page;
        req.params.limit = limit;
        next();
    }
};



export default CommonMiddleWares;