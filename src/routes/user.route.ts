import { Router } from "express";
import { getUserById, registerUser } from "../controllers/user.controller";


const router =Router();


router.route("/register").post(registerUser);
router.route("/get-user/:userId").get(getUserById)


export default router;