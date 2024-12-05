import { Router } from "express";
import { getOrderById, getRecentOrders, placeOrder, updateOrder } from "../controllers/order.controller";


const router=Router();

router.route("/place-order").post(placeOrder);
router.route("/get-order/:orderId").get(getOrderById);
router.route("/get-recent-orders").get(getRecentOrders);
router.route("/update-order/:orderId").patch(updateOrder)


export default router;