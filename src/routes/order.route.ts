import { Router } from "express";
import { getOrderById, getRecentOrders, placeOrder } from "../controllers/order.controller";


const router=Router();

router.route("/place-order").post(placeOrder);
router.route("/get-order/:orderId").get(getOrderById);
router.route("/get-recent-orders").get(getRecentOrders);


export default router;