const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const ApiHandler = require("../utils/api-handler");
const { query, response } = require("express");
const recipeAPI = new ApiHandler(
  process.env.EDAMAM_APP_ID,
  process.env.EDAMAM_APP_KEY
);

/* This builds a MongoDB query from the filter values sent by recipe-filter.js
query format example: { healthLabels: {$all: dietRestrictions}} - It's going to be longer soon!*/

function queryCreator(filterData) {
  let theQuery = {};  
  if (filterData.healthLabels) {
    theQuery.healthLabels = {
     $all: filterData.healthLabels.$all
    }
  }
  if (filterData.dietLabels) {
    theQuery.dietLabels = {
      $all: filterData.dietLabels.$all
     }
  }
  if (filterData.cuisineType) {
    theQuery.cuisineType = {
      $all: filterData.cuisineType.$all
     }
  }
  if (filterData.mealType) {
    theQuery.mealType = {
      $all: filterData.mealType.$all
     }
  }
  if (filterData.dishType) {
    theQuery.dishType = {
      $all: filterData.dishType.$all
     }
  }
  // Also need to do nº Ingredients + calories + time needed + ingredients to exclude
  return theQuery
}


/* GET home page */

router.get("/", (req, res, next) => {
 // recipeAPI.crawl("seitan");
    Recipe.find()
    .limit(12)
    .then((foundRecipes) => {
      // Need to format some fields to present on the front-end, namely rounding calories and capitalizing some strings
      foundRecipes.forEach((item) => {item.calories = Math.round(item.calories)});
      // foundRecipes.forEach((item) => {
      //   item.cuisineType.forEach((cuisine) => {cuisine = cuisine[0].toUppercase() + cuisine.substring(1); console.log(cuisine)})
      //   });
      
      res.render("index", { foundRecipes });
    })
    .catch((err) => next(err));
});

router.post("/", (req, res, next) => {
  if (req.body.isFiltering) {
    Recipe.find(queryCreator(req.body))
      .limit(12)
      .then((queryResults) => {
        // console.log("the query results ", queryResults);
        res.send(queryResults);
      })
      .catch((err) => next(err));
  } else {
    Recipe.find()
      .limit(12)
      .then((queryResults) => {
        res.send(queryResults);
      })
      .catch((err) => next(err));
  }
});

module.exports = router;


