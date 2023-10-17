const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }

  next();
};

const isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.redirect("/");
  }

  next();
};

export { isAuth, isAdmin, isLoggedIn };
