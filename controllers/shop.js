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

export { getProducts };
