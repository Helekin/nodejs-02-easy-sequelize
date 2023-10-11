import express from "express";
import { check } from "express-validator";

import {
  getCategories,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  postEditCategory,
} from "../controllers/admin.js";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories", isAuth, isAdmin, getCategories);

router.get("/add-category", isAuth, isAdmin, getAddCategory);

router.post(
  "/add-category",
  isAuth,
  isAdmin,
  check("title").not().isEmpty().withMessage("This field is required"),

  postAddCategory
);

router.get("/edit-category/:categoryId", isAuth, isAdmin, getEditCategory);

router.post("/edit-category", isAuth, isAdmin, postEditCategory);

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

router.post(
  "/edit-product",
  isAuth,
  isAdmin,
  check("title").not().isEmpty().withMessage("This field is required"),
  postEditProduct
);

router.post("/delete-product", isAuth, isAdmin, postDeleteProduct);

export default router;
