const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");


router.get("/:label", (req, res, next) => {
  const { label } = req.params;

    Recipe.findOne({label:label})
      .then((theRecipe) => { console.log('theRecipe :>> ', theRecipe);
        res.render("users/recipe-single", {findOne: theRecipe})
      })      
      .catch(error => console.log(`Error while editing: ${error}`));

  
});

module.exports = router;
