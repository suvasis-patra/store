import { Router } from "express";
import { getOrdersByUser, getUserById, registerUser, updateUser } from "../controllers/user.controller";


const router =Router();


router.route("/register").post(registerUser);
router.route("/get-user/:userId").get(getUserById);
router.route("/get-user-order/:userId").get(getOrdersByUser)
router.route("/update-user/:userId").patch(updateUser);


export default router;