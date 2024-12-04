import express from "express";
import userRouter from "./routes/user.controller"
import { notFoundErrorHandler } from "./controllers/error.controller";
import { errorHandler } from "./middlewares/error.middleware";

const app=express();

app.use(express.json());


app.use("/api/v1/user",userRouter)
app.use(errorHandler)
app.all("*",notFoundErrorHandler)



export {app}