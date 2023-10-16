import express from "express";

import { getProductById, getProducts } from "../controllers/shop.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/product/:productId", getProductById);

export default router;
