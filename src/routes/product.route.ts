import { Router } from "express";
import { createProduct, getProductById, getTotalProductQuantity } from "../controllers/product.controller";


const router =Router();


router.route("/create-product").post(createProduct);
router.route("/get-product/:productId").get(getProductById)
router.route("/get-total-products").get(getTotalProductQuantity)


export default router;