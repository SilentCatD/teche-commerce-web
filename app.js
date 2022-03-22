import express from 'express';
import 'dotenv/config';
import webPageRouter from "./router/frontend/web_page.js"; 
import adminPageRouter from "./router/frontend/admin_page.js"; 

import { router as api } from "./router/api/api.js";

import database from "./database/database.js";
import __dirname from './dirname.js';
import testRouter from './router/test/test.js';
const app = express();

app.set('view engine', 'ejs');
app.use(express.static( __dirname  + '/public',  {index: false}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api', api);
app.use('/admin',adminPageRouter);
app.use('/test', testRouter)
app.use('/user', webPageRouter);

app.listen(process.env.PORT || 3000, async ()=> {
  await database.instance.connect();
  console.log(`Server is running at: ${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}`);
});


