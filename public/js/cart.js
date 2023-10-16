function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

function addToCart(product) {
  let cart = localStorage.getItem("cart");
  cart = cart
    ? JSON.parse(cart)
    : { cartItems: [], shippingAddress: {}, paymentMethod: "Paypal" };

  const existItem = cart.cartItems.find((item) => item.id === product.id);

  if (existItem) {
    cart.cartItems = cart.cartItems.map((item) =>
      item.id === existItem.id ? product : item
    );
  } else {
    cart.cartItems = [...cart.cartItems, product];
  }

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);

  cart.taxPrice = addDecimals(Number(0.15 * cart.itemsPrice).toFixed(2));

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(cart));
}
