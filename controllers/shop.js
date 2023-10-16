import Product from "../models/product.js";
import Category from "../models/category.js";

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { isVisible: true },
      include: [{ model: Category, as: "category" }],
      order: [["createdAt", "DESC"]],
    });

    res.render("shop/index", {
      prods: products,
      pageTitle: "Welcome to Easy Shop",
      path: "/",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findOne({
      where: { id: prodId, isVisible: true },
    });

    if (!product) {
      res.redirect("/");
    }

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/product",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export { getProducts, getProductById };
