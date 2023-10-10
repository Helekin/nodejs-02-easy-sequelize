import express from "express";

import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin.js";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/add-product", isAuth, isAdmin, getAddProduct);

router.get("/products", isAuth, isAdmin, getProducts);

router.post("/add-product", isAuth, isAdmin, postAddProduct);

router.get("/edit-product/:productId", isAuth, isAdmin, getEditProduct);

router.post("/edit-product", isAuth, isAdmin, postEditProduct);

router.post("/delete-product", isAuth, isAdmin, postDeleteProduct);

export default router;
