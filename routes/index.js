const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const axios = require('axios');

/* saving the code to warm up it and eat it later. Mmmm, leftovers
 
axios.get("https://api.edamam.com/api/recipes/v2/96ae20daad99c35d721f1eb96ecdf9ba?type=public&app_id=5bf94e03&app_key=6505fc7507ee610a167d9c57a10c5cae")
  .then(response => Recipe.create(response.data))
  .catch(err => console.log(err));

*/


/* GET home page */
router.get("/", (req, res, next) => {
   axios.get("https://api.edamam.com/api/recipes/v2?type=public&q=%20tofu&app_id=5bf94e03&app_key=6505fc7507ee610a167d9c57a10c5cae&health=vegan&health=vegetarian&random=true")
  .then(response => {
    Recipe.create(response.data.hits);
  })
  .then(
    Recipe.find()
    .limit(1)
    .then(foundRecipes => {
      console.log(foundRecipes[0]);
      res.render("index", {foundRecipes})
    }))
  .catch(err => console.log(err))
  
});

module.exports = router;
