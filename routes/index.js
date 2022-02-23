const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const ApiHandler = require("../utils/api-handler");
const { query, response } = require("express");
const recipeAPI = new ApiHandler(
  process.env.EDAMAM_APP_ID,
  process.env.EDAMAM_APP_KEY
);

/* saving the code to warm up it and eat it later. Mmmm, leftovers
 
 recipeAPI
    .importRecipes("seitan", ["vegetarian", "vegan"], "asian")
    .then((recipes) => {
       recipes.data.hits.forEach((element) => {
        let {
          uri,
          label,
          image,
          images,
          source,
          url,
          shareAs,
          yield,
          dietLabels,
          healthLabels,
          cautions,
          ingredientLines,
          ingredients,
          calories,
          glycemicIndex,
          totalC02Emissions,
          totalWeight,
          cuisineType,
          mealType,
          dishType,
          totalNutrients,
          totalDaily,
          digest,
        } = element.recipe;
        Recipe.create({
          uri,
          label,
          image,
          images,
          source,
          url,
          shareAs,
          yield,
          dietLabels,
          healthLabels,
          cautions,
          ingredientLines,
          ingredients,
          calories,
          glycemicIndex,
          totalC02Emissions,
          totalWeight,
          cuisineType,
          mealType,
          dishType,
          totalNutrients,
          totalDaily,
          digest,
        });
      });
    })
    .catch((err) => console.log(err));

*/

/* This will build a MongoDB query from the filter values sent by recipe-filter.js
function queryCreator(query) {
    let queryString = "{";
    if (query.healthLabels) {
      queryString += '"recipe.healthLabels": {$all: ['
      query.healthLabels.forEach(val => {
        queryString += `${val},` 
      }); 
      queryString +=']}'
    }
    queryString += "}"
    return queryString
}
*/

// query format example: { healthLabels: {$all: dietRestrictions}}
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
  const dietRestrictions = req.body.healthLabels.$all;
  const { healthLabels } = req.body;
  console.log("dietRestrictions on the post route index.js:>> ", dietRestrictions);
  console.log(req.body.healthLabels);
  if (dietRestrictions.length != 0) {
    Recipe.find({ healthLabels: {$all: dietRestrictions}})
      .limit(5)
      .then((queryResults) => {
        // console.log("the query results ", queryResults);
        res.send(queryResults);
      })
      .catch((err) => next(err));
  } else {
    Recipe.find()
      .limit(5)
      .then((queryResults) => {
        res.send(queryResults);
      })
      .catch((err) => next(err));
  }
});

module.exports = router;
