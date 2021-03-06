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

/* This builds a MongoDB query from the filter values sent by recipe-filter.js */

function queryCreator(filterData) {
  let theQuery = {};  
  console.log(filterData);
  if (filterData.search != "") {
    theQuery.label = {
      $regex: filterData.search,
      $options: "i"
    }
  }
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
  if (filterData.calories.$gte != "") {
    theQuery.calories = {
      $gte: filterData.calories.$gte
    } 
     }

  if (filterData.calories.$lte != "") {
    theQuery.calories = {
      $lte: filterData.calories.$lte
    }
  }

  //Mongodb Atlas wont let us use "where" on the free tier. BOOOO!

// if (filterData.ingredients.$lte != "" && filterData.ingredients.$gte != "") {
//   theQuery.$where = `this.ingredients.length <= ${filterData.ingredients.$lte} && this.ingredients.length >= ${filterData.ingredients.$gte}`
// } else if (filterData.ingredients.$lte != "") {
//   theQuery.$where = `this.ingredients.length <= ${filterData.ingredients.$lte}`
// } else if (filterData.ingredients.$gte != "") {
//   theQuery.$where = `this.ingredients.length >= ${filterData.ingredients.$gte}`
// }

  // Also need to do ingredients to exclude - there was no time, sadly.
  return theQuery
}

/* Homepage Routes */

router.get("/", (req, res, next) => {
Recipe.findRandom({}, {}, {limit:12}, function(err, foundRecipes) {
  if (!err && foundRecipes) {
    cleanRecipeListInfo(foundRecipes);
    res.render("index", { foundRecipes })
  }
  });
});

router.post("/", (req, res, next) => {
    if (req.body.isFiltering) {
    Recipe.find(queryCreator(req.body))
      .limit(12)
      .skip(req.body.skipResults)
      .then((foundRecipes) => {
        cleanRecipeListInfo(foundRecipes);        
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

router.get("/crawlRecipes", (req, res, next) => {
  /* Leaving this here as an example - see utils/api-handler.js for the full(ish) info */
  recipeAPI.crawl(["seitan", "vegetarian"], null);
});

module.exports = router;

