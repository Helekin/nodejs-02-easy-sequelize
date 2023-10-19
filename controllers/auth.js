import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import User from "../models/user.js";

import generateToken from "../utils/generateToken.js";

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
      validationErrors: [],
    });
  }

  try {
    const user = await User.findOne({
      where: { email: email },
      attributes: {
        exclude: ["password"],
      },
    });

    if (user) {
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: "User already exists",
        validationErrors: [],
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
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    validationErrors: [],
  });
};

const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password",
        validationErrors: [],
      });
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password",
        validationErrors: [],
      });
    }

    generateToken(res, user.id);

    req.session.isLoggedIn = true;
    req.session.isAdmin = user.isAdmin;
    req.session.jwt = req.cookies.jwt;
    req.session.user = user;

    return req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.redirect("/");
  });
};

export { getSignup, postSignUp, getLogin, postLogin, postLogout };
