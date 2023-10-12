import { validationResult } from "express-validator";

import Category from "../models/category.js";

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
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
    path: "/admin/categories/add-category",
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
      path: "/admin/categories/add-category",
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
        path: "/admin/categories/add-category",
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
      path: "/admin/categories/edit-category",
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

  try {
    const category = await Category.findByPk(catId);

    if (!category) {
      return res.redirect("/");
    }

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-category", {
        pageTitle: "Edit Category",
        path: "/admin/categories/edit-category",
        editing: true,
        category: category,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
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

const postHideCategory = async (req, res, next) => {
  const catId = req.body.categoryId;

  try {
    const category = await Category.findByPk(catId);

    if (!category) {
      return res.redirect("/admin/categories");
    }

    await Category.update(
      {
        isVisible: false,
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

const postShowCategory = async (req, res, next) => {
  const catId = req.body.categoryId;

  try {
    const category = await Category.findByPk(catId);

    if (!category) {
      return res.redirect("/admin/categories");
    }

    await Category.update(
      {
        isVisible: true,
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

export {
  getCategories,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  postEditCategory,
  postHideCategory,
  postShowCategory,
};
