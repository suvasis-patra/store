import { Router } from "express";
import { placeOrder } from "../controllers/order.controller";


const router=Router();

router.route("/place-order").post(placeOrder)


export default router;