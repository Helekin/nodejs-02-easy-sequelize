import express from "express";
import { check } from "express-validator";

import { getSignup, postSignUp } from "../controllers/auth.js";

const router = express.Router();

router.get("/signup", getSignup);

router.post(
  "/signup",
  check("name").not().isEmpty().withMessage("This field is required"),
  check("email").isEmail().withMessage("Not a valid e-mail address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Your password must be a minimum of six characters"),
  postSignUp
);

export default router;
