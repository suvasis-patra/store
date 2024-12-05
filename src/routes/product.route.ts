import { Router } from "express";
import { createProduct, getProductById, getTotalProductQuantity, updateProduct } from "../controllers/product.controller";


const router =Router();


router.route("/create-product").post(createProduct);
router.route("/get-product/:productId").get(getProductById)
router.route("/get-total-products").get(getTotalProductQuantity)
router.route("/update-product/:productId").patch(updateProduct)


export default router;