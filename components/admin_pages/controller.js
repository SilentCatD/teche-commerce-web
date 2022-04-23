import BrandService from "../brand/service.js";
import CategotyService from "../category/service.js";
import ProductService from "../product/service.js";

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
  },
  accounts: async (req, res) => {
    const param = { title: "Accounts", active: ["accounts"] };
    res.render("admin/accounts", param);
  },

  profile: async(req, res)=>{
    const param = { title: "Profile", active: [] };
    res.render("admin/profile", param);
  }

};

export default AdminPageController;
