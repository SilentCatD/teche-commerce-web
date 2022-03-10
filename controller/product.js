import database from "../database/database.js";

const ProductController = {
    createProduct: async (req, res) => {
        // console.log(req.body);
        // let a = req.body.imagesMetaData;
        // console.log(JSON.parse(a));
        // console.log(req.files);
        // res.end();
        try {
            const {
                productName,
                productDetails,
                productBrand,
                productCategory,
                productPrice
            } = req.body;

            const imagesMetaData = JSON.parse(req.body.imagesMetaData);
            
            let productImages = null;
            if (req.files) {
                productImages = req.files;
            }
        
            const id = await database.instance.createProduct(productName, productPrice, productBrand,
                productCategory, productDetails,
                imagesMetaData, productImages);
            res.status(201).end(`Product created with id ${id}`);
        } catch (e) {
            console.log(e);
            res.status(402).end(`Can't create product, something went wrong: ${e}`);
        }

    },
    fetchAllProduct: async (req, res) => {
        try {
            const query =req.query;
            const result = await database.instance.fetchAllProduct(query.limit , query.sort, query.type);
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
            await database.instance.deleteAllProduct();
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
            const result = await database.instance.fetchProduct(id);
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
            await database.instance.deleteProduct(id);
            res.writeHead(200,{
                "Content-Type":"application/json"
            });
            res.status(200).end("Delete success");
        } catch(e) {
            console.log(e);
            res.status(404).end("Product can not delete");
        }
    }
};

export default ProductController;