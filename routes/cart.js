import express from "express";

import { getCart } from "../controllers/cart.js";

const router = express.Router();

router.get("/", getCart);

export default router;
