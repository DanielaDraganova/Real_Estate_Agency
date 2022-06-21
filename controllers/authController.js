const authService = require("../services/authService");

const router = require("express").Router();
const { COOKIE_SESSION_NAME } = require("../constants");
const { getAllErrors } = require("../utils/errorHelpers");
const { isAuth, isGuest } = require("../middlewares/authMiddleware");

router.get("/register", isGuest, (req, res) => {
  res.render("auth/register");
});

router.post("/register", isGuest, async (req, res) => {
  const { name, username, password, repass } = req.body;

  if (password !== repass) {
    return res.render("auth/register", {
      allErrors: ["Passwords don't match!"],
    });
  }

  try {
    //Create user
    const createdUser = await authService.create({
      name,
      username,
      password,
    });

    const token = await authService.createToken(createdUser);
    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });

    // !!! in case the user needs to log in after registration
    res.redirect("/");
  } catch (err) {
    // add mongoose error mapper
    return res.render("auth/register", {
      allErrors: getAllErrors(err),
      ...req.body,
    });
  }
});

router.get("/login", isGuest, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isGuest, async (req, res, next) => {
  const { username, password } = req.body;
  console.log("INSIDE POST LOGIN");
  console.log(username, password);
  try {
    const user = await authService.login(username, password);
    const token = await authService.createToken(user);

    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.log("MY ERR: ", err);
    res.render("auth/login", { allErrors: [err.message] });
  }
});

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie(COOKIE_SESSION_NAME);
  res.redirect("/");
});

module.exports = router;
