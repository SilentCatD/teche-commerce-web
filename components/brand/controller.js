import BrandService from './service.js'

const BrandController = {
    createBrand: async (req, res) => {
        try {
            const {
                brandName
            } = req.body;
            let brandImg = []
            if (req.files) {
                brandImg = req.files;
            }
            console.log(req.files);
            const id = await BrandService.createBrand(brandName, brandImg);
            res.status(201).end(`Brand created with id ${id}`);
        } catch (e) {
            console.log(e);
            res.status(402).end(`Can't create brand, something went wrong: ${e}`);
        }
    },
    fetchAllBrand: async (req, res) => {
        try {
            const query =req.query;
            console.log(req.query);
            const result = await BrandService.fetchAllBrand(query.page,query.limit , query.sort, query.type);
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.status(200).end(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            res.status(404).end("Not Found");
        }
    },
    fetchBrand: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const result = await BrandService.fetchBrand(id);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.status(200).end(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            res.status(404).end(e.message);
        }
    },

    deleteAllBrand: async (req, res) => {
        try {
            await BrandService.deleteAllBrand();
            res.status(200).end("All brands deleted");
        } catch (e) {
            console.log(e);
            res.status(404).end("Failed to delete some brands, try again");
        }
    },
    deleteBrand: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            await BrandService.deleteBrand(id);
            res.status(200).end("Brand deleted");
        } catch (e) {
            console.log(e);
            res
                .status(404)
                .end("Can't delete brand, it's not exist or something went wrong");
        }
    },
    editBrand: async (req, res) => {
        try {
            const {
                brandName
            } = req.body;
            const {
                id
            } = req.params;
            let brandImages = undefined;
            if (req.files.length > 0) {
                console.log(req.files)
                brandImages = req.files;
            }
            await BrandService.editBrand(id,brandName,brandImages);
            res.status(200).end("brand successfully edit")
        } catch (e) {
            console.log(e);
            res.status(404)
        }
    }
};

export default BrandController;
