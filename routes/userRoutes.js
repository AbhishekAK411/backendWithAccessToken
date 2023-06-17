import express from "express";
import { checkPass, checkRegister } from "../middlewares/auth.js";
import { getMovies, regenToken, register } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", checkRegister, register);
router.post("/regenToken", checkPass, regenToken);
router.post("/getVideo", checkPass, getMovies);

export default router;