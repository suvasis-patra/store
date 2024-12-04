import express from "express";
import userRouter from "./routes/user.controller"
import { notFoundErrorHandler } from "./controllers/error.controller";
import { errorHandler } from "./middlewares/error.middleware";
import productRouter from "./routes/product.controller"

const app=express();

app.use(express.json());


app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)


app.all("*",notFoundErrorHandler)
app.use(errorHandler)



export {app}