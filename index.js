const express = require("express");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const { connect } = require("./config/database");
const { auth } = require("./middlewares/authMiddleware");
const { errorHandler } = require("./middlewares/errorHandlerMiddleware");

const app = express();
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(auth);
app.use(routes);
app.use(errorHandler);

connect();
app.listen(3000, () => {
  console.log(`Express app listening on port 3000...`);
});
