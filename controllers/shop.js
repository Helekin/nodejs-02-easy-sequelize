// import Product from "../models/product.js";
// import Cart from "../models/cart.js";

// const getProducts = async (req, res, next) => {
//   try {
//     const products = await Product.findAll();

//     res.render("shop/product-list", {
//       prods: products,
//       pageTitle: "All Products",
//       path: "/products",
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     next(error);
//   }
// };

// const getProduct = async (req, res, next) => {
//   const prodId = req.params.productId;

//   try {
//     const product = await Product.findByPk(prodId);

//     res.render("shop/product-detail", {
//       pageTitle: product.title,
//       product: product,
//       path: "/products",
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     next(error);
//   }
// };

// const getIndex = async (req, res, next) => {
//   try {
//     const products = await Product.findAll();

//     res.render("shop/index", {
//       prods: products,
//       pageTitle: "Shop",
//       path: "/",
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     next(error);
//   }
// };

// const getCart = (req, res, next) => {
//   Cart.getCart((cart) => {
//     Product.fetchAll((products) => {
//       const cartProducts = [];

//       for (let product of products) {
//         const cartProduct = cart.products.find((p) => p.id === product.id);
//         if (cartProduct) {
//           cartProducts.push({ product: product, qty: cartProduct.qty });
//         }
//       }
//       res.render("shop/cart", {
//         pageTitle: "Your cart",
//         path: "/cart",
//         products: cartProducts,
//       });
//     });
//   });
// };

// const postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, (product) => {
//     Cart.addProduct(prodId, product.price);
//   });
//   res.redirect("/cart");
// };

// const getOrders = (req, res, next) => {
//   res.render("shop/orders", {
//     pageTitle: "Your orders",
//     path: "/orders",
//   });
// };

// const getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Checkout",
//     path: "/checkout",
//   });
// };

// const postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, (product) => {
//     Cart.deleteProduct(prodId, product.price);
//     res.redirect("/cart");
//   });
// };

// export {
//   getProducts,
//   getProduct,
//   getIndex,
//   getCart,
//   postCart,
//   getCheckout,
//   getOrders,
//   postCartDeleteProduct,
// };
