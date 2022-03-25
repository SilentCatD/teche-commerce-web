const CommonServices = {
    queryAllWithModel: async (model, limit, page, sortParams, range) =>{
        const totalCount = await model.countDocuments(range);
        const totalPages = Math.ceil(totalCount / limit);
        if(page && page > totalPages){
            page=totalPages;
        }
        const items = await model.find(range)
            .skip(limit * page - limit)
            .limit(limit).sort(sortParams);
        const result = {
            ...(limit && { "total-pages": totalPages }),
            ...(limit && { "current-page": page ? page : 1 }),
            "total-items": totalCount,
            "item-count": items.length,
            "items": items,
        };
        return result;
    }
};

export default CommonServices;