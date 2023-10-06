import path from "path";
import express from "express";

import sequelize from "./config/db.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

import { get404 } from "./controllers/error.js";

const __dirname = path.resolve();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

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
