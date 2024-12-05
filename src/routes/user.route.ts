import { Router } from "express";
import { getOrdersByUser, getUserById, getUserByProduct, registerUser, updateUser } from "../controllers/user.controller";


const router =Router();


router.route("/register").post(registerUser);
router.route("/get-user/:userId").get(getUserById);
router.route("/get-user-order/:userId").get(getOrdersByUser)
router.route("/update-user/:userId").patch(updateUser);
router.route("/get-user-by-product/:productId").get(getUserByProduct)


export default router;