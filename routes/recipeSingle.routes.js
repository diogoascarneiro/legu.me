const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const { cleanRecipeListInfo, cleanRecipeObjInfo } = require("../utils/recipe-data-cleaner");
const { isLoggedIn } = require("../middleware/auth.middleware");

router.get("/recipes/:label", (req, res, next) => {
  const { label } = req.params;

  Recipe.findOne({ label: label })
    .then((theRecipe) => {
      cleanRecipeObjInfo(theRecipe);
      // Get four random recipes of the same type for the "related recipes" bit
      Recipe.findRandom({ dishType: theRecipe.dishType }, {}, { limit: 4 }, function (err, randomResults) {
        if (!err) {
          cleanRecipeListInfo(randomResults);
          res.render("recipeSingle", {
            recipe: theRecipe,
            randomRecipes: randomResults,
          });
        }
      });
    })
    .catch((error) => console.log(error));
});

router.post("/recipes/:label", isLoggedIn, (req, res, next) => {
  const { isFavourite } = req.body;
  const { label } = req.params;
/*
  //Getting the ID of the current recipe first, then add it to the favouriteRecipes array on the user model. Will it work? I dunno
  Recipe.findOne({ label: label })
  .then((theRecipe) => {
    //console.log(theRecipe._id);
  User.findByIdAndUpdate(req.session.currentUser._id, { $push: {favouriteRecipes: theRecipe._id }}, {new: true} )
  .then((user)=> console.log("ya did it, user is now", user))
  .catch((err) => console.log(err));
  })
  .catch(err => next(err));
  
  //console.log("Current User", req.session.currentUser);
  */
});

module.exports = router;
