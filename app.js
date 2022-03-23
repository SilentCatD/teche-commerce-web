import express from 'express';
import 'dotenv/config';
import database from "./components/database/database.js";
import __dirname from './dirname.js';
import router from './router/router.js';

const app = express();


app.set('view engine', 'ejs');
app.use(express.static( __dirname  + '/public',  {index: false}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(router);

app.get("/",(req, res, next) =>{
  res.redirect("/user");
})

app.listen(process.env.PORT || 3000, async ()=> {
  // await database.instance.connect();
  console.log(`Server is running at: ${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}`);
});


