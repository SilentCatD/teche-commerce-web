import express from "express";
import __dirname from "../../dirname.js";
import ProductService from "../../components/product/service.js";
import EmailVerificationService from "../../components/email_verification/service.js";
import passport from "passport";
import AuthenticationService from "../../components/authentication/service.js";

const webPageRouter = express.Router();

// For Login (actually we just need login)
webPageRouter.get("/login",async (req, res) => {
    res.render('user/login');
});


// webPageRouter.get('/login/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

webPageRouter.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  webPageRouter.get('/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

webPageRouter.get("/signup",async (req, res) => {
    res.render('user/signup');
});


// ohter shiting route

webPageRouter.get('/', async (req, res)=>{
    const params = {title: "Teche Home"};
    res.render('user/index',params);
});


webPageRouter.get('/shop', async (req, res)=>{
    try{
        const products = await ProductService.modelQueryAll(null,9,1,'createAt');
        const params = {title: "Teche Shop", products: products};
        res.render('user/shop-grid',params);
    }
    catch(e){
        console.log(e);
        res.status(404).send();
    }
});

webPageRouter.get('/contact', async (req, res)=>{
    const params = {title: "Teche Contact"};
    res.render('user/contact',params);
});


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




export default webPageRouter;