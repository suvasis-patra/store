import express from "express";
import userRouter from "./routes/user.route"
import { notFoundErrorHandler } from "./controllers/error.controller";
import { errorHandler } from "./middlewares/error.middleware";
import productRouter from "./routes/product.route"
import orderRouter from "./routes/order.route"
import { testEndPoint } from "./controllers/test.controller";

const app=express();

app.use(express.json());

app.get("/health",testEndPoint);
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/order",orderRouter)


app.all("*",notFoundErrorHandler)
app.use(errorHandler)



export {app}