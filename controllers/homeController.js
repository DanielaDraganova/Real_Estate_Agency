const router = require("express").Router();
const housingService = require("../services/housingService");

router.get("/", async (req, res) => {
  const housings = await housingService.getLastThree().lean();
  let hasHousings = housings.length > 0;
  res.render("home", { housings, hasHousings });
});

module.exports = router;
