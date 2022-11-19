import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouter from "./route/web";
import connectdb from "./config/connectDB"
import cors from 'cors'

require('dotenv').config();

let app = express();
app.use(cors({ origin: true }));
//config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


viewEngine(app);
initWebRouter(app);
connectdb();
let port = process.env.PORT || 6969;

app.listen(port, () => {
   //call back
   console.log("BACKEND NODEJS " + port)
});