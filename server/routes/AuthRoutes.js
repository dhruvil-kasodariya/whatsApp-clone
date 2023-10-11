import {Router} from "express"
import  {checkUser, getAllUser, onboardUser } from "../controllers/AuthController.js";

const router =Router();

router.post("/check-user",checkUser);
router.post("/onboard-user",onboardUser);
router.get("/get-contacts",getAllUser);

export default router