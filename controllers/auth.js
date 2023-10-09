import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import User from "../models/user.js";

const getSignup = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    validationErrors: [],
  });
};

const postSignUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  if (password !== confirmPassword) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: "Passwords do not match",
    });
  }

  try {
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
  }
};

export { getSignup, postSignUp };
