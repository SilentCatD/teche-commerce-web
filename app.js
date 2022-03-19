import express from 'express';
import 'dotenv/config';
import { router as webPage } from "./router/frontend/web_page.js"; 
import { router as api } from "./router/api/api.js";
import { router as test} from "./router/frontend/test.js";
// import {cors} from 'cors';

import database from "./database/database.js";
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// // I don't actually know cors doing
// const corsOption = {
//   origin: "http://localhost:3000"
// };
// app.use(cors())


app.use('/api', api);
app.use('/', webPage);
app.use('/homepage',test);


app.listen(process.env.PORT || 3000, async ()=> {
  await database.instance.connect();
  console.log(`Server is running at: ${process.env.CONNECTION_TYPE}://${process.env.HOST_URL}:${process.env.PORT}`);
});


