import { validationResult } from "express-validator";

import Category from "../models/category.js";
import User from "../models/user.js";
import Product from "../models/product.js";

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
        path: "/admin/products/add-product",
        editing: false,
        categories: categories,
        errorMessage: "You must create a category before adding a product",
        validationErrors: [],
      });
    } else {
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/products/add-product",
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
      path: "/admin/products/add-product",
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

  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const prodId = req.params.productId;

  try {
    const product = await Product.findByPk(prodId);

    if (!product) {
      return res.redirect("/");
    }

    const categories = await Category.findAll();

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/products/edit-product",
      editing: editMode,
      categories: categories,
      product: product,
      errorMessage: message,
      validationErrors: [],
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
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedCountInStock = req.body.countInStock;
  const updatedBrand = req.body.brand;
  const updatedCategoryId = req.body.category;

  const errors = validationResult(req);

  try {
    const product = await Product.findByPk(prodId);

    const categories = await Category.findAll();

    if (!product) {
      return res.redirect("/");
    }

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/products/edit-product",
        editing: true,
        product: product,
        categories: categories,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    await Product.update(
      {
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        countInStock: updatedCountInStock,
        brand: updatedBrand,
        categoryId: updatedCategoryId,
      },
      { where: { id: prodId } }
    );

    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
};
