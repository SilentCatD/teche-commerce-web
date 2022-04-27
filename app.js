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

app.listen(process.env.PORT || 3000, async function(){
  await database.instance.connect();
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});