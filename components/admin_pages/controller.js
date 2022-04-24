import BrandService from "../brand/service.js";
import CategotyService from "../category/service.js";
import ProductService from "../product/service.js";
import UserService from "../user/service.js";

const AdminPageController = {
  home: async (req, res) => {
    const param = { title: "Dashboard", active: ["dashboard"] };
    res.render("admin/index", param);
  },
  login: async (req, res) => {
    const param = { title: "Login" };
    res.render("admin/login", param);
  },
  products: async (req, res) => {
    const param = { title: "Products", active: ["store", "products"] };
    res.render("admin/products", param);
  },
  brands: async (req, res) => {
    const param = { title: "Brands", active: ["store", "brands"] };
    res.render("admin/brands", param);
  },
  categories: async (req, res) => {
    const param = { title: "Categories", active: ["store", "categories"] };
    res.render("admin/categories", param);
  },
  editProduct: async (req, res) => {
    const { id } = req.params;
    try{
      const product = await ProductService.fetchProduct(id);
      let brands = await BrandService.brandQueryAll();
      let categories = await CategotyService.categoryQueryAll();
      brands = brands.items;
      categories = categories.items
      brands = product.brand
        ? brands.filter((brand) => {
            return brand.id != product.brand.id;
          })
        : brands;
      categories = product.category
        ? categories.filter((category) => {
            return category.id != product.category.id;
          })
        : categories;
  
      brands = brands.map((brand) => {
        return {
          id: brand.id,
          name: brand.name,
        };
      });
  
      categories = categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
        };
      });
  
      const param = {
        title: "Edit Product",
        active: ["store", "products"],
        product: product,
        categories: categories,
        brands: brands,
      };
      res.render("admin/edit-product", param);
    } catch(e){
      const param = { title: "404", active: []};
      res.render('admin/404', param);
    }
   
  },
  accounts: async (req, res) => {
    const param = { title: "Accounts", active: ["accounts"] };
    res.render("admin/accounts", param);
  },

  profile: async(req, res)=>{
    const param = { title: "Profile", active: [] };
    res.render("admin/profile", param);
  },

  details: async(req, res)=>{
    const id = req.params.id;
    try{
      const user = await UserService.fetchUser(id);
      const param = { title: user.name, active: [], user: user};
      res.render("admin/profile_detail", param);
    }catch(e){
      const param = { title: "404", active: []};
      res.render("admin/404", param);
    }

  }

};

export default AdminPageController;
