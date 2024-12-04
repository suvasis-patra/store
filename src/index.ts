import dotenv from "dotenv";
import {app} from "./app";

dotenv.config();


app.listen(process.env.PORT||8080,()=>console.log(`server is running on port ${process.env.PORT}`))