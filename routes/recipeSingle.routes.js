const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const {cleanRecipeObjInfo} = require("../utils/recipe-data-cleaner");


router.get("/recipes/:label", (req, res, next) => {
  const { label } = req.params;
   
   Recipe.findOne({label:label})
      .then((theRecipe) => { 
        console.log(theRecipe);
        cleanRecipeObjInfo(theRecipe);
        res.render("recipeSingle", {recipe: theRecipe})
      })      
      .catch(error => console.log(error));

  
});

module.exports = router;
