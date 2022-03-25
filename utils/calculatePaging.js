import isInt from "./is_int.js";

async function calculatePaging(page,limit,model)  {
    const result = {};
    
    result.totalItem = await model.countDocuments();
    if(!isInt(limit)) {
        result.totalPage = 1;
        result.skipItem = 0;
        result.limit = null;
        
    } else {
        limit =  parseInt(limit);

        if(limit < result.totalItem){
            result.totalPage = Math.floor(result.totalItem / limit);
        }
        else result.totalPage = 1;


        if(!isInt(page) || page < 1) page = 1;
        else page = parseInt(page);

        if(page >= result.totalPage) page = result.totalPage;
        else page = page;

        console.log(page);
        result.skipItem = limit*(page-1);
        result.limit = limit;
    }
    console.log(result);
    return result;
}

export default calculatePaging;