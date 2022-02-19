const router = require("express").Router();


router.get("/single-recipe", (req, res, next) => {
  res.render("users/recipe-single");
});

module.exports = router;
