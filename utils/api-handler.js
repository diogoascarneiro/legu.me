const axios = require('axios');
const Recipe = require('../models/Recipe.model');

/* 
Recipe data types:
    query = String (mandatory),
    health (vegetarian, gluten-free, etc ) = Array or String,
    cuisineType = Array or String,
    mealType = Array or String,
    dishType = Array or String,
    calories = String:
         can be a minimum value by adding a plus symbol at the end (calories = "150+"")
         can be a range (calories = "150-300")
         can be a maximum value (calories = "300")
    diet (low-carb, low-fat, etc)= array or string
    ingr (number of ingredients) = String (same as calories)
    time (time range for the total cooking and prep time) = String (same as calories & ingr)
    excluded = Array or String,
    random = true or false

    For CALORIES, INGR and TIME the "+" must be encoded as "%2B"

Refer to https://developer.edamam.com/edamam-docs-recipe-api for params 
*/

class ApiHandler {
  constructor(appID, appKey) {
    this.api = axios.create({
      baseURL: `https://api.edamam.com/api/recipes`,
    });
    this.appID = appID;
    this.appKey = appKey;
    this.iteration = 1;
  }

  /* Methods go here */

  importRecipes(
    query,
    health = "vegetarian",
    cuisineType,
    mealType,
    dishType,
    calories,
    diet,
    ingr,
    time,
    excluded,
    random,
    imageSize = "LARGE"
  ) {
    let apiQuery = `/v2?type=public&app_id=${this.appID}&app_key=${this.appKey}&q=${query}`;
    const paramsObj = {
      health,
      cuisineType,
      mealType,
      dishType,
      calories,
      diet,
      ingr,
      time,
      excluded,
      random,
      imageSize,
    };

    for (const property in paramsObj) {
      //Check if not empty
      if (paramsObj[property]) {
        // Check for arrays and add all of their values
        if (typeof paramsObj[property] === "object") {
          paramsObj[property].forEach((theValue) => {
            apiQuery += `&${property}=${theValue}`;
          });
        } else {
          apiQuery += `&${property}=${paramsObj[property]}`;
        }
      }
    }
    console.log(apiQuery);
    return this.api.get(apiQuery);
    
  }

  importRecipesURL(url) {
  return this.api.get(url);
  }

  // below is WIP. The goal is to import recipes en masse,
  // check them against the ones on the database and add them if they're not there already
  // parseAndCreate accepts the .data.hits array from a call to the api (in the crawl function below it comes as recipes.data.hits)

  parseAndCreate(data) {
    data.forEach((element) => {
        let {
            uri,
            label,
            image,
            images,
            source,
            url,
            shareAs,
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
          //yield is a reserved keyword apparently, so we have to do this separately.
          let theYield = element.recipe.yield;
          Recipe.create({
          uri,
          label,
          image,
          images,
          source,
          url,
          shareAs,
          yield: theYield,
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
  })
}
 
crawl(initialQuery, nextBatch) {
   if (initialQuery) {
    this.importRecipes(...initialQuery)
    .then((recipes) => {
          this.parseAndCreate(recipes.data.hits);
          console.log(recipes.data);
          nextBatch = recipes.data._links.next.href;
          this.crawl(false, nextBatch);
    })
    .catch((err) => console.log(err));
   }  
  
    if (nextBatch) {
      setTimeout(() => {this.importRecipesURL(nextBatch)
        .then(recipes => {
          this.parseAndCreate(recipes.data.hits);
          if ('next' in recipes.data._links) {
            nextBatch = recipes.data._links.next.href;
          } else {
            nextBatch = false;
          }
          this.crawl(false, nextBatch)
        })
         this.iteration++; }, 10000);
          
    }

   console.log("Crawled this many pages :>>", this.iteration);
   if (!initialQuery && !nextBatch) {
     console.log("Crawling (...in my skin, these wounds they will not heal) complete");
     return
   }
  
  
}

}
module.exports = ApiHandler;