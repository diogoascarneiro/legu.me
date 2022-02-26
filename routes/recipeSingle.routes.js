const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

router.get("/recipes/:label", (req, res, next) => {
  const { label } = req.params;
   
   Recipe.findOne({label:label})
      .then((theRecipe) => { 
        res.render("recipeSingle", {recipe: theRecipe})
      })      
      .catch(error => console.log(error));

  
});

module.exports = router;
