const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");



const {cleanRecipeListInfo, cleanRecipeObjInfo} = require("../utils/recipe-data-cleaner");
const { isLoggedIn } = require("../middleware/auth.middleware");


router.get("/recipes/:label", (req, res, next) => {
  const { label } = req.params;
   
   Recipe.findOne({label:label})
      .then((theRecipe) => { 
        //console.log(theRecipe);
        cleanRecipeObjInfo(theRecipe);

        Recipe.findRandom({dishType: theRecipe.dishType}, {}, {limit:4}, function(err, randomResults) {
          if (!err) {
            cleanRecipeListInfo(randomResults);
            res.render("recipeSingle", {
              recipe: theRecipe,
              randomRecipes: randomResults
            })
          }
          });
        //res.render("recipeSingle", {recipe: theRecipe})
      })      
      .catch(error => console.log(error));

  
});

router.post("/recipes/:label", isLoggedIn, (req, res, next) => {
const {isFavourite} = req.body;
console.log("Current User", req.session.currentUser);
// User.findOne({})

});

module.exports = router;
