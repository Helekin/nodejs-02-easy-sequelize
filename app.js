import flash from "connect-flash";
import SequelizeStore from "connect-session-sequelize";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "path";

import sequelize from "./config/db.js";

import Category from "./models/category.js";
import Order from "./models/order.js";
import OrderItem from "./models/orderItem.js";
import Product from "./models/product.js";
import Review from "./models/review.js";
import User from "./models/user.js";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import shopRoutes from "./routes/shop.js";
import cartRoutes from "./routes/cart.js";

import { get404 } from "./controllers/error.js";

dotenv.config();

const SequelizeDBStore = SequelizeStore(session.Store);

const __dirname = path.resolve();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const sessionStore = new SequelizeDBStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(cookieParser());

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.token = req.cookies.jwt;
  res.locals.isAdmin = req.session.isAdmin;

  next();
});

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  try {
    const user = await User.findByPk(req.session.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return next();
    }

    req.user = user;

    next();
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
});

app.use("/", authRoutes);
app.use("/", shopRoutes);
app.use("/admin/categories", categoryRoutes);
app.use("/admin/products", productRoutes);
app.use("/cart", cartRoutes);

app.use(get404);

// app.use((error, req, res, next) => {
//   res.status(500).render("500", {
//     pageTitle: "Error",
//     path: "/500",
//     isAuthenticated: req.session.isLoggedIn,
//   });
// });

User.hasMany(Product);
Product.belongsTo(User);
Category.hasMany(Product);
Product.belongsTo(Category);
User.hasMany(Review);
Review.belongsTo(User);
Product.hasMany(Review);
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
