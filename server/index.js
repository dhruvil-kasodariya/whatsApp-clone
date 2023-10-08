import express from 'express';
import dotenv from "dotenv";
import cors from "cors"
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import  methodOverride from 'method-override';
import AuthRouter from "./routes/AuthRoutes.js"

dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("Database connected")).catch((err)=>console.log(err));

const app =express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("X-HTTP-Method-Override"));

app.use("/api/auth",AuthRouter)

const server =app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`)
})
