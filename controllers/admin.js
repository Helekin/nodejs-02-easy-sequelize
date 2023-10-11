import { validationResult } from "express-validator";

import Category from "../models/category.js";
import User from "../models/user.js";
import Product from "../models/product.js";

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        isVisible: true,
      },
      order: [["createdAt", "DESC"]],
    });

    res.render("admin/categories", {
      pageTitle: "Categories",
      path: "/admin/categories",
      categories: categories,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getAddCategory = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("admin/edit-category", {
    pageTitle: "Add Category",
    path: "/admin/add-category",
    editing: false,
    errorMessage: message,
    validationErrors: [],
  });
};

const postAddCategory = async (req, res, next) => {
  const title = req.body.title;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-category", {
      pageTitle: "Add Category",
      path: "/admin/add-category",
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const category = await Category.findOne({
      where: { title: title.toUpperCase() },
    });

    if (category) {
      return res.status(422).render("admin/edit-category", {
        pageTitle: "Add Category",
        path: "/admin/add-category",
        editing: false,
        errorMessage: "This category already exists",
        validationErrors: [],
      });
    }

    await Category.create({
      title: title.toUpperCase(),
    });

    res.redirect("/admin/categories");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getEditCategory = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const catId = req.params.categoryId;

  try {
    const category = await Category.findByPk(catId);

    if (!category) {
      return res.redirect("/");
    }

    res.render("admin/edit-category", {
      pageTitle: "Edit Product",
      path: "/admin/edit-category",
      editing: editMode,
      category: category,
      errorMessage: message,
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postEditCategory = async (req, res, next) => {
  const catId = req.body.categoryId;
  const title = req.body.title;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-category", {
      pageTitle: "Edit Category",
      path: "/admin/edit-category",
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const category = await Category.findByPk(catId);

    if (!category) {
      return res.redirect("/");
    }

    await Category.update(
      {
        title: title.toUpperCase(),
      },
      { where: { id: catId } }
    );

    res.redirect("/admin/categories");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: User, as: "user" },
        { model: Category, as: "category" },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getAddProduct = async (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  try {
    const categories = await Category.findAll();

    if (categories.length <= 0) {
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        categories: categories,
        errorMessage: "You must create a category before adding a product",
        validationErrors: [],
      });
    } else {
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        categories: categories,
        errorMessage: message,
        validationErrors: [],
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const countInStock = req.body.countInStock;
  const brand = req.body.brand;
  const categoryId = req.body.category;
  const userId = req.user.id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    await Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      brand: brand,
      countInStock: countInStock,
      categoryId: categoryId,
      userId: userId,
    });

    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  try {
    const product = await Product.findByPk(prodId);

    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  try {
    await Product.update(
      {
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
      },
      { where: { id: prodId } }
    );

    res.redirect("/admin/products");
  } catch (err) {}
};

const postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  await Product.destroy({
    where: {
      id: prodId,
    },
  });

  res.redirect("/admin/products");
  try {
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export {
  getCategories,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  postEditCategory,
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
