import express from "express";
import { check } from "express-validator";

import {
  getLogin,
  getSignup,
  postLogin,
  postLogout,
  postSignUp,
} from "../controllers/auth.js";

const router = express.Router();

router.get("/signup", getSignup);

router.get("/login", getLogin);

router.post(
  "/signup",
  check("name").not().isEmpty().withMessage("This field is required"),
  check("email").isEmail().withMessage("Not a valid e-mail address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Your password must be a minimum of six characters"),
  postSignUp
);

router.post(
  "/login",
  check("email").isEmail().withMessage("Not a valid e-mail address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Your password must be a minimum of six characters"),
  postLogin
);

router.post("/logout", postLogout);

export default router;
