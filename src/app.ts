import express from "express";
import userRouter from "./routes/user.controller"

const app=express();

app.use(express.json());


app.use("/api/v1/user",userRouter)



export {app}