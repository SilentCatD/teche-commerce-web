import CategotyService from "./service.js";

const CategoryController = {
    createCategory: async (req, res) => {
        try {
            const {
                categoryName
            } = req.body;
            const id = await CategotyService.createCategory(categoryName);
            res.status(201).end(`Category created with id ${id}`);
        } catch (e) {
            console.log(e);
            res.status(402).end(`Can't create category, something went wrong: ${e}`);
        }
    },
    fetchAllCategory: async (req, res) => {
        try {
            const result = await CategotyService.fetchAllCategory();
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.status(200).end(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            res.status(404).end("Not Found");
        }
    },
    fetchCategory: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const result = await CategotyService.fetchCategory(id);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.status(200).end(JSON.stringify(result));
        } catch (e) {
            console.log(e);
            res.status(404).end("Category not exist");
        }
    },

    deleteAllCategory: async (req, res) => {
        try {
            await CategotyService.deleteAllCategory();
            res.status(200).end("All Categorys deleted");
        } catch (e) {
            console.log(e);
            res.status(404).end("Failed to delete some categories, try again");
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            await CategotyService.deleteCategory(id);
            res.status(200).end("Category deleted");
        } catch (e) {
            console.log(e);
            res
                .status(404)
                .end("Can't delete category, it's not exist or something went wrong");
        }
    },
    editCategory: async (req, res) => {
        try {
            const {
                categoryName
            } = req.body;
            const {
                id
            } = req.params;            
            await CategotyService.editCategory(id,categoryName);
            res.status(200).end("Category successfully edit")
        } catch (e) {
            console.log(e);
            res.status(404).end(e.msg);
        }
    }
};

export default CategoryController;
