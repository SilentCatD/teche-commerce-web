import express from "express";
import __dirname from "../../dirname.js";
import ProductService from "../../components/product/service.js";
import EmailVerificationService from "../../components/email_verification/service.js";
import AuthenticationController from "../../components/authentication/controller.js";

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
    res.redirect("/");
  });



webPageRouter.get("/signup",async (req, res) => {
    res.render('user/signup');
});


// ohter shiting route

webPageRouter.get('/', async (req, res)=>{
    const params = {title: "Teche Home", tab: 'home'};
    res.render('user/index',params);
});


webPageRouter.get('/shop', async (req, res)=>{
    try{
        const params = {title: "Teche Shop", tab: 'shop'};
        res.render('user/shop-grid',params);
    }
    catch(e){
        console.log(e);
        res.status(404).send();
    }
});

webPageRouter.get('/contact', async (req, res)=>{
    const params = {title: "Teche Contact", tab: 'contact'};
    res.render('user/contact',params);
});

webPageRouter.get('/profile',async (req, res)=>{
    const params = {title: "Teche Profile", tab: 'none'};
    res.render('user/profile', params);
})


webPageRouter.get('/details/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(id);
    try{
        const product = await ProductService.fetchProduct(id);
        const params = {title: `Teche ${product.name}`, product: product};
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