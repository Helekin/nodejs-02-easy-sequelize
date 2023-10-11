import express from "express";
import { check } from "express-validator";

import {
  getAddCategory,
  postAddCategory,
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin.js";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/add-category", isAuth, isAdmin, getAddCategory);

router.post(
  "/add-category",
  isAuth,
  isAdmin,
  check("title").not().isEmpty().withMessage("This field is required"),

  postAddCategory
);

router.get("/add-product", isAuth, isAdmin, getAddProduct);

router.get("/products", isAuth, isAdmin, getProducts);

router.post(
  "/add-product",
  isAuth,
  isAdmin,
  check("title").not().isEmpty().withMessage("This field is required"),
  check("imageUrl").not().isEmpty().withMessage("This field is required"),
  check("price").not().isEmpty().withMessage("This field is required"),
  check("brand").not().isEmpty().withMessage("This field is required"),
  check("description").not().isEmpty().withMessage("This field is required"),
  check("countInStock").not().isEmpty().withMessage("This field is required"),
  postAddProduct
);

router.get("/edit-product/:productId", isAuth, isAdmin, getEditProduct);

router.post("/edit-product", isAuth, isAdmin, postEditProduct);

router.post("/delete-product", isAuth, isAdmin, postDeleteProduct);

export default router;
