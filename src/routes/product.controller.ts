import { Router } from "express";
import { createProduct, getProductById } from "../controllers/product.controller";


const router =Router();


router.route("/create-product").post(createProduct);
router.route("/get-product/:productId").get(getProductById)


export default router;