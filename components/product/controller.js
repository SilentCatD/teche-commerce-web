import ProductService from "./service.js";

const ProductController = {
    createProduct: async (req, res) => {
        try {
            const {
                productName,
                productDetails,
                productBrand,
                productCategory,
                productPrice
            } = req.body;
            let productImages = []
            if (req.files) {
                productImages = req.files;
            }
            
            const id = await ProductService.createProduct(productName, productPrice, productBrand,
                productCategory, productDetails, productImages);
            res.status(201).end(`Product created with id ${id}`);
        } catch (e) {
            console.log(e);
            res.status(402).end(`Can't create product, something went wrong: ${e}`);
        }

    },
    fetchAllProduct: async (req, res) => {
        try {
            const query =req.query;
            const result = await ProductService.fetchAllProduct(query.limit , query.sort, query.type);
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.status(200).end(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            res.status(404).end("Not Found");
        }
    },

    deleteAllProduct: async (req, res) => {
        try {
            await ProductService.deleteAllProduct();
            res.status(200).end("All Product deleted");
        } catch (e) {
            console.log(e);
            res.status(404).end("Failed to delete all product, try again");
        }
    },

    fetchProduct: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const result = await ProductService.fetchProduct(id);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.status(200).end(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            res.status(404).end("Product not exist");
        }
    },

    deleteProduct: async (req, res) => {
        try{
            const {
                id
            } = req.params;
            await ProductService.deleteProduct(id);
            res.status(200).end("Delete success");
        } catch(e) {
            console.log(e);
            res.status(404).end("Product can not delete");
        }
    },
    editProduct: async (req,res) => {
        try {
            const {
                productName,
                productDetails,
                productBrand,
                productCategory,
                productPrice
            } = req.body;
            const {
                id
            } = req.params;
            let productImages = undefined;
            if (req.files.length > 0) {
                console.log(req.files)
                productImages = req.files;
            }
            await ProductService.editProduct(id,productName,productPrice, productBrand, productCategory,productDetails,productImages);
            res.status(200).end("Edit Product successfully");
        } catch (e){
            console.log(e);
            res.status(404).end(e.message);
        }
    },
};

export default ProductController;