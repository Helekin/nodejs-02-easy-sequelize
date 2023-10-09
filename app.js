import path from "path";
import express from "express";
import flash from "connect-flash";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";

import sequelize from "./config/db.js";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

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
app.use(flash());

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

app.use(get404);

sequelize
  .sync()
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
