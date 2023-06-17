import express from "express";
import { checkRegister } from "../middlewares/auth.js";
import { register } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", checkRegister, register);

export default router;