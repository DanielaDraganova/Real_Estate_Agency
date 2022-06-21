const router = require("express").Router();

const { isAuth } = require("../middlewares/authMiddleware");
const housingService = require("../services/housingService");
const userService = require("../services/userService");
const { getAllErrors } = require("../utils/errorHelpers");

router.get("/", async (req, res) => {
  const housings = await housingService.getAll().lean();
  res.render("housing", { housings });
});

router.get("/create-offer", isAuth, (req, res) => {
  res.render("housing/create-offer");
});

router.post("/create-offer", isAuth, async (req, res) => {
  const housingData = { ...req.body, owner: req.user._id };

  try {
    const housing = await housingService.create(housingData);
    await userService.addHousing(req.user._id, housing._id);
    res.redirect("/housing");
  } catch (err) {
    console.log("ERROR: ", err);
    res.render("housing/create-offer", {
      ...req.body,
      allErrors: getAllErrors(err),
    });
  }
});

router.get("/:housingId/details", async (req, res) => {
  const housing = await housingService
    .getOneWithOwner(req.params.housingId)
    .lean();
  console.log(housing);

  const isOwner = housing.owner._id == req.user?._id;
  let peopleRentedNames = housing.rentedAhome.map((p) => p.name).join(", ");
  if (peopleRentedNames.length == 0) {
    peopleRentedNames = "There are no tenants yet.";
  }

  let isLoggedIn = req.user;
  let isRented = housing.rentedAhome.find(
    (x) => x._id.toString() == req.user?._id
  );

  let isAlreadyRented = isLoggedIn && isRented;

  // check if has available pieces
  let isAvailable = false;

  if (housing.rentedAhome.length < housing.availablePieces) {
    isAvailable = true;
  }

  const showRentButton = !isOwner && isAvailable && !isAlreadyRented;
  const showAlreadyRented = !isOwner && isAlreadyRented;
  const showNotAvailable = !isAvailable;

  const freeSpaces = housing.availablePieces - housing.rentedAhome.length;

  res.render("housing/details", {
    ...housing,
    peopleRentedNames,
    isOwner,
    showRentButton,
    showAlreadyRented,
    showNotAvailable,
    freeSpaces,
  });
});

router.get("/:housingId/rent", isAuth, async (req, res) => {
  const housing = await housingService.getOne(req.params.housingId);

  housing.rentedAhome.push(req.user._id);
  await housing.save();
  res.redirect(`/housing/${req.params.housingId}/details`);
});

router.get("/:housingId/delete", isAuth, async (req, res) => {
  const housing = await housingService
    .getOneWithOwner(req.params.housingId)
    .lean();
  console.log(housing);

  const isOwner = housing.owner._id == req.user?._id;
  await housingService.deleteOne(req.params.housingId);
  res.redirect("/housing");
});

router.get("/:housingId/edit", isAuth, async (req, res) => {
  const housing = await housingService.getOne(req.params.housingId).lean();
  const isOwner = housing.owner == req.user?._id;

  if (!isOwner) {
    res.redirect("/");
  }

  res.render("housing/edit", { ...housing });
});

router.post("/:housingId/edit", isAuth, async (req, res) => {
  const housing = await housingService.getOne(req.params.housingId).lean();
  console.log("EDIT", housing);
  const isOwner = housing.owner == req.user?._id;

  if (!isOwner) {
    return next({ message: "You are not authorized!", status: 401 });
  }

  try {
    await housingService.updateOne(req.params.housingId, req.body);
    res.redirect(`/housing/${req.params.housingId}/details`);
  } catch (err) {
    res.render("housing/edit", {
      ...req.body,
      allErrors: getAllErrors(err),
    });
  }
});

module.exports = router;
