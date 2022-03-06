import express from "express";
import 'dotenv/config';
import { router as webPage } from "./router/web_page.js"; 
import { router as brand } from "./router/api/brand.js";
import database from "./database/database.js";
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/v1/brand', brand);
app.use('/', webPage);

app.listen(process.env.PORT || 3000, function() {
  database.instance.connect();
  console.log("Server is running port: 3000");
});

