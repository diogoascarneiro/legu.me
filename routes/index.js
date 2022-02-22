const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const ApiHandler = require("../utils/api-handler");
const recipeAPI = new ApiHandler(
  process.env.EDAMAM_APP_ID,
  process.env.EDAMAM_APP_KEY
);

/* saving the code to warm up it and eat it later. Mmmm, leftovers
 
 recipeAPI.importRecipes("seitan", ["vegetarian", "vegan"], "asian")
  .then(recipes => console.log(recipes))
  .catch(err => console.log(err));

*/

/* GET home page */

router.get("/", (req, res, next) => {
  Recipe.find()
    .limit(5)
    .then((foundRecipes) => {
      res.render("index", { foundRecipes });
    })
    .catch((err) => next(err));
});

router.post("/", (req, res, next) => {
  const { dietRestrictions } = req.body;
  Recipe.find({ dietLabels: dietRestrictions })
    .limit(5)
    .then((queryResults) => res.send(queryResults))
    .catch((err) => next(err));
});

module.exports = router;
