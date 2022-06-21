const jwt = require("jsonwebtoken");
const { COOKIE_SESSION_NAME, SECRET } = require("../constants");

// Authentication  - recognizes the user
exports.auth = async (req, res, next) => {
  const token = req.cookies[COOKIE_SESSION_NAME];

  if (token) {
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err) {
        res.clearCookie(COOKIE_SESSION_NAME);
        //ако токена е невалиден може да пратим на 404 или да ни редиректне на логин
        //return next(err);
        return res.redirect("/auth/login");
      }

      req.user = decodedToken;
      res.locals.user = decodedToken;

      next();
    });
  } else {
    next();
  }
};

// Authorization -
exports.isAuth = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  }
  next();
};

exports.isGuest = (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  }
  next();
};
