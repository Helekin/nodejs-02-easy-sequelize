import Product from "../models/product.js";
import Category from "../models/category.js";

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { isVisible: true },
      include: [{ model: Category, as: "category" }],
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

export { getProducts };
