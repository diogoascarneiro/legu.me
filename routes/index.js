const router = require("express").Router();
const { query, response } = require("express");

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const ApiHandler = require("../utils/api-handler");
const recipeAPI = new ApiHandler(
  process.env.EDAMAM_APP_ID,
  process.env.EDAMAM_APP_KEY
);

const {cleanRecipeListInfo} = require("../utils/recipe-data-cleaner");

/* This builds a MongoDB query from the filter values sent by recipe-filter.js
query format example: { healthLabels: {$all: dietRestrictions}} - It's going to be longer soon!*/

function queryCreator(filterData) {
  let theQuery = {};  
  if (filterData.healthLabels.$all.length != 0) {
    theQuery.healthLabels = {
     $all: filterData.healthLabels.$all
    }
  }
  if (filterData.cuisineType.$in.length != 0) {
    theQuery.cuisineType = {
      $in: filterData.cuisineType.$in
     }
  }
  if (filterData.mealType.$in.length != 0) {
    theQuery.mealType = {
      $in: filterData.mealType.$in
     }
  }
  if (filterData.dishType.$in.length != 0) {
    theQuery.dishType = {
      $in: filterData.dishType.$in
     }
  }
  // Also need to do nº Ingredients + calories + time needed + ingredients to exclude
  return theQuery
}

/* Homepage Routes */

router.get("/", (req, res, next) => {
// recipeAPI.crawl("candy");
    Recipe.find()
    .limit(12)
    .then((foundRecipes) => {
      cleanRecipeListInfo(foundRecipes);
      res.render("index", { foundRecipes });
    })
    .catch((err) => next(err));
});

router.post("/", (req, res, next) => {
  console.log('req.body :>> ', req.body);
  //console.log(queryCreator(req.body));
  if (req.body.isFiltering) {
    Recipe.find(queryCreator(req.body))
      .limit(12)
      .skip(req.body.skipResults)
      .then((foundRecipes) => {
        cleanRecipeListInfo(foundRecipes);
       console.log("the query results ", foundRecipes);
        
        res.send(foundRecipes);
      })
      .catch((err) => next(err));
  } else {
    Recipe.find()
      .limit(12)
      .skip(req.body.skipResults)
      .then((foundRecipes) => {
        cleanRecipeListInfo(foundRecipes);
        res.send(foundRecipes);
      })
      .catch((err) => next(err));
  }
});

module.exports = router;

