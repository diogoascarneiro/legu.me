const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");


/* GET home page */
router.get("/", (req, res, next) => {
  axios.get("/api/recipes/v2/a420ea59b1e9a0ec054859421027796b")
  .then(response => Recipe.create({response}))
  .catch(err => console.log(error));

  res.render("index", {response}); 
});

module.exports = router;
