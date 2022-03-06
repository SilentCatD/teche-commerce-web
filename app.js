import express from "express";
import 'dotenv/config';
import { router as webPage } from "./router/web_page.js"; 
import { router as brand } from "./router/api/brand.js";
import { router as img } from "./router/api/image.js";
import database from "./database/database.js";
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/v1/brand', brand);
app.use('/api/v1/image', img);
app.use('/', webPage);

app.listen(process.env.PORT || 3000, function() {
  database.instance.connect();
  console.log(`Server is running at: ${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}`);
});


