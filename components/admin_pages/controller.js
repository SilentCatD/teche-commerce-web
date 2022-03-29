import ProductService from "../product/service.js";

const AdminPageController = {
    home: async (req, res)=>{
        const param = {title: "Dashboard", active: ['dashboard']};
        res.render('admin/index', param);
    },
    login: async(req, res)=>{
        const param = {title: "Login"};
        res.render('admin/login', param);
    },
    products: async(req, res)=>{
        const param = {title: "Products", active: ['store','products']};
        res.render('admin/products', param);
    },
    brands: async(req, res)=>{
        const param = {title: "Brands", active: ['store','brands']};
        res.render('admin/brands', param);
    },
    categories:  async(req, res)=>{
        const param = {title: "Categories", active: ['store','categories']};
        res.render('admin/categories', param);
    },

    editProduct: async(req, res)=>{
        const {id}  = req.params;
        const product = await ProductService.fetchProduct(id);
        const param = {title: "Edit Product", active: ['store','products'], product: product};
        res.render('admin/edit-product', param);
    },


};

export default AdminPageController;