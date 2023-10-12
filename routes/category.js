import express from "express";
import { check } from "express-validator";

import {
  getCategories,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  postEditCategory,
  postHideCategory,
  postShowCategory,
} from "../controllers/category.js";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuth, isAdmin, getCategories);

router.get("/add-category", isAuth, isAdmin, getAddCategory);

router.post(
  "/add-category",
  isAuth,
  isAdmin,
  check("title").not().isEmpty().withMessage("This field is required"),

  postAddCategory
);

router.get("/edit-category/:categoryId", isAuth, isAdmin, getEditCategory);

router.post(
  "/edit-category",
  isAuth,
  isAdmin,
  check("title").not().isEmpty().withMessage("This field is required"),
  postEditCategory
);

router.post("/hide-category", isAuth, isAdmin, postHideCategory);

router.post("/show-category", isAuth, isAdmin, postShowCategory);

export default router;
