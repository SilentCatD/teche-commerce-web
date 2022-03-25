import isInt from "./is_int.js";

async function calculatePaging(limit,page,model)  {
    const result = {};
    result.totalItem = await model.countDocuments();
    if(!isInt(limit)) {
        result.totalPage = 1;
        result.skipItem = 0;
        result.limit = null;
        
    } else {
        if(!isInt(page) || page < 1) page = 1;
        result.totalPage = Math.floor(result.totalItem / limit);
        result.skipItem = limit*page;
        result.limit = limit;
    }
    return result;
}

export default calculatePaging;