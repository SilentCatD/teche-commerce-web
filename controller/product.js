const ProductController = {
    createProduct: async (req, res)=>{
        console.log(req.body);
        console.log(req.files);
        res.end();
    }
}

export default ProductController;