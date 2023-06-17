import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import router from "./routes/userRoutes.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use("/api/v1",router);

mongoose.connect('mongodb+srv://abhishek:Glorious%40Mongo41@atlascluster.htagarr.mongodb.net/accesstokenDB?retryWrites=true&w=majority')
.then(()=> console.log("DB connection established."))
.catch((err)=> console.log("DB Error --->", err));

app.listen(3000);