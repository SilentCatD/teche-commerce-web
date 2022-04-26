import express from 'express';
import 'dotenv/config';
import database from "./components/database/database.js";
import __dirname from './dirname.js';
import router from './router/router.js';
import passport from 'passport';
import passportInit from './config/passport_config.js';


passportInit(passport);

const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use(express.static( __dirname  + '/public',  {index: false}));
app.use(router);

app.listen(process.env.PORT || 3000, 'localhost',async ()=> {
  await database.instance.connect();
  console.log(`Server is running`);
});

