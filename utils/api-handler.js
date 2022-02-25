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
    }

    /* Methods go here */

    // NOTE: ADD GETTING ONLY RECIPES WITH LARGE IMAGES AS DEFAULT
    importRecipes(query, health=["vegetarian", "vegan"], cuisineType, mealType, dishType, calories, diet, ingr, time, excluded, random) {
       let apiQuery =`/v2?type=public&app_id=${this.appID}&app_key=${this.appKey}&q=${query}`;
       const paramsObj = { health, cuisineType, mealType, dishType, calories, diet, ingr, time, excluded, random };
      
        for (const property in paramsObj) {
            //Check if not empty
            if (paramsObj[property]) {
               // Check for arrays and add all of their values
                if (typeof paramsObj[property] === "object") {
                    paramsObj[property].forEach((theValue)=>{
                        apiQuery+= `&${property}=${theValue}`;
                    })     
                } 
                else {apiQuery+= `&${property}=${paramsObj[property]}`;} 
            
            }
        }
       return this.api.get(apiQuery);
    }

    // below is WIP. The goal is to import recipes en masse,
    // check them against the ones on the database and add them if they're not there already
   /* crawl(query) {
        this.importRecipes(query)
        .then(results => {
            if (!Recipe.find(results.label)) {
                Recipe.create(results)
            }
        })
    }*/
}

module.exports = ApiHandler;