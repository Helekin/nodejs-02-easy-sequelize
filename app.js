import path from "path";
import express from "express";
import flash from "connect-flash";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import sequelize from "./config/db.js";

import User from "./models/user.js";
import Category from "./models/category.js";
import Product from "./models/product.js";
import Review from "./models/review.js";
import Order from "./models/order.js";
import OrderItem from "./models/orderItem.js";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
// import shopRoutes from "./routes/shop.js";

import { get404 } from "./controllers/error.js";

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
    secret: "secret_session_shop",
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

app.use(async (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.token = req.cookies.jwt;

  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret_session_shop");

      const user = await User.findByPk(decoded.userId, {
        attributes: {
          exclude: ["password"],
        },
      });

      res.locals.isAdmin = user.isAdmin;
      req.user = user;
    } catch (error) {
      console.log(error);
    }
  }

  next();
});

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
// app.use("/", shopRoutes);

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
