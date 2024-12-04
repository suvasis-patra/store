import { Router } from "express";
import { getOrderById, placeOrder } from "../controllers/order.controller";


const router=Router();

router.route("/place-order").post(placeOrder);
router.route("/get-order/:orderId").get(getOrderById)


export default router;