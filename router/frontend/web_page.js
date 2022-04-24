import express from "express";
import __dirname from "../../dirname.js";
import ProductService from "../../components/product/service.js";
import EmailVerificationService from "../../components/email_verification/service.js";
import AuthenticationController from "../../components/authentication/controller.js";
import BrandService from "../../components/brand/service.js";
import CategotyService from "../../components/category/service.js";

const webPageRouter = express.Router();

// For Login (actually we just need login)
webPageRouter.get("/login",async (req, res) => {
    res.render('user/login');
});


webPageRouter.get('/login/google/callback',
AuthenticationController.loginByGoogleAccount,
function(req, res) {
    res.cookie("accessToken",res.data.accessToken);
    res.cookie("refreshToken",res.data.refreshToken);
    res.cookie("role", res.data.role);
    res.redirect("/");
  });



webPageRouter.get("/signup",async (req, res) => {
    res.render('user/signup');
});


// ohter shiting route

webPageRouter.get('/', async (req, res)=>{
    const latestProducts = (await ProductService.productQueryAll(null, 6, 1, {"createdAt": -1}, null, null, null)).items;
    const topRatedProducts = (await ProductService.productQueryAll(null, 6, 1, {"rateAverage": -1}, null, null, null)).items;
    const topViewProducts = (await ProductService.productQueryAll(null, 6, 1, {"viewCount": -1}, null, null, null)).items;
    const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
    const params = {title: "Teche Home", tab: 'home',latestProducts : latestProducts, topRatedProducts :topRatedProducts, topViewProducts :topViewProducts,categories: categories};
    res.render('user/index',params);
});


webPageRouter.get('/shop', async (req, res)=>{
    const brands = (await BrandService.brandQueryAll(null, null, 1, null, null)).items;
    const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
    const params = {title: "Teche Shop", tab: 'shop', brands: brands, categories: categories,query:req.query.query};
    res.render('user/shop-grid',params);
});

webPageRouter.get('/contact', async (req, res)=>{
    const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
    const params = {title: "Teche Contact", tab: 'contact',categories: categories};
    res.render('user/contact',params);
});

webPageRouter.get('/profile',async (req, res)=>{
    const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
    const params = {title: "Teche Profile", tab: 'none',categories: categories};
    res.render('user/profile', params);
})

webPageRouter.get('/cart',async (req, res)=>{
    const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
    const params = {title: "Teche Cart", tab: 'none',categories: categories};
    res.render('user/shopping-cart', params);
})

webPageRouter.get('/order', async (req, res)=>{
    const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
    const params = {title: "Teche Orders", tab: 'order',categories: categories};
    res.render('user/order',params);
});

webPageRouter.get('/checkout',async (req, res)=>{
    const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
    const params = {title: "Teche Checkout", tab: 'none',categories: categories};
    res.render('user/checkout', params);
})


webPageRouter.get('/details/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        const categories = (await CategotyService.categoryQueryAll(null, null, 1, null, null)).items;
        const product = await ProductService.fetchProduct(id);
        const params = {title: `Teche ${product.name}`, product: product,tab:"none",categories: categories};
        res.render('user/shop-details',params);
    }
    catch(e){
        console.log(e);
        res.status(404).send();
    }
});

webPageRouter.get('/active/:hash', async (req, res)=>{
    const {hash} = req.params;
    const routeParams = {
        hash: hash
    }
    if(await EmailVerificationService.verifyHashActiveEmail(hash)){
        return res.render('user/active', routeParams);
    }
    return res.status(404).end();
});

webPageRouter.get('/reset-password/:hash', async (req, res)=>{
    const {hash} = req.params;
    if(await EmailVerificationService.verifyHasResetPwd(hash)){
        return res.render('user/forget-password', {hash: hash});
    }
    return res.status(404).end();
});


export default webPageRouter;