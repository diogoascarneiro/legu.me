const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const { cleanRecipeListInfo, cleanRecipeObjInfo } = require("../utils/recipe-data-cleaner");
const { isLoggedIn } = require("../middleware/auth.middleware");

router.get("/recipes/:label", (req, res, next) => {
  const { label } = req.params;
  let isFavourite;

  if ("currentUser._id" in req.session) {
   Recipe.findOne({ label: label })
    .then((theRecipe) => {
      User.findById(req.session.currentUser._id)
      .then((user) => {
        if (user.favouriteRecipes.indexOf(theRecipe._id) === -1) {
          isFavourite = false;
        } else {isFavourite = true}
      })
      .then(() => {
        cleanRecipeObjInfo(theRecipe);
        // Get four random recipes of the same type for the "related recipes" bit
        Recipe.findRandom({ dishType: theRecipe.dishType }, {}, { limit: 4 }, function (err, randomResults) {
          if (!err) {
            cleanRecipeListInfo(randomResults);
            res.render("recipeSingle", {
              recipe: theRecipe,
              randomRecipes: randomResults,
              isFavourite
            });
          }
        });
      })
    })
    .catch((error) => console.log(error));
  } else {
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
  }

});

router.post("/recipes/:label", isLoggedIn, (req, res, next) => {
  const { label } = req.params;
  const { isFavourite } = req.body;

  //Getting the ID of the current recipe first, then add it to the favouriteRecipes array on the user model. Will it work? I dunno
  Recipe.findOne({ label: label })
    .then((theRecipe) => {
      //console.log(theRecipe._id);
      User.findById(req.session.currentUser._id).then((user) => {
        if (user.favouriteRecipes.indexOf(theRecipe._id) === -1) {
          User.updateOne({ _id: req.session.currentUser._id }, { $push: { favouriteRecipes: theRecipe._id } }, {new:true})
          .then(()=> console.log("added fav recipe"))
          .catch(err => next(err));
        } else {
          User.updateOne({ _id: req.session.currentUser._id }, { $pull: { favouriteRecipes: theRecipe._id } }, {new:true})
          .then(()=> console.log("removed fav recipe"))
          .catch(err => next(err));
        }
        console.log('req.session.currentUser._id :>> ', req.session.currentUser);
      });
    })
    .catch((err) => next(err));

});

module.exports = router;