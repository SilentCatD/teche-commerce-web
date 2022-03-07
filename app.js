import express from "express";
import 'dotenv/config';
import { router as webPage } from "./router/frontend/web_page.js"; 
import { router as api } from "./router/api/api.js";

import database from "./database/database.js";
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api', api);
app.use('/', webPage);

app.listen(process.env.PORT || 3000, async ()=> {
  await database.instance.connect();
  console.log(`Server is running at: ${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}`);
});


