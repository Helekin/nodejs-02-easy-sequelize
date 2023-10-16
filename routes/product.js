import express from "express";
import { check } from "express-validator";

import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
} from "../controllers/product.js";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuth, isAdmin, getProducts);

router.get("/add-product", isAuth, isAdmin, getAddProduct);

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
  check("imageUrl").not().isEmpty().withMessage("This field is required"),
  check("price").not().isEmpty().withMessage("This field is required"),
  check("brand").not().isEmpty().withMessage("This field is required"),
  check("description").not().isEmpty().withMessage("This field is required"),
  check("countInStock").not().isEmpty().withMessage("This field is required"),
  postEditProduct
);

export default router;
