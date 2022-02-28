const cleanRecipeListInfo = function (dbQueryResponse) {
    dbQueryResponse.forEach((item) => {
      item.calories = Math.round(item.calories);
      item.healthLabelsString = item.healthLabels.join(', ');
      item.dishTypeString = item.dishType.join(', ');
      item.mealTypeString = item.mealType.join(', ');
      item.cuisineTypeString = item.cuisineType.join(', ');
      for (const property in item.totalNutrients) {
        item.totalNutrients[property].quantity = Math.round(item.totalNutrients[property].quantity)
      }
    });
  }

  const cleanRecipeObjInfo = function (recipeObj) { 
    recipeObj.calories = Math.round(recipeObj.calories);
    recipeObj.healthLabelsString = recipeObj.healthLabels.join(', ');
    recipeObj.dishTypeString = recipeObj.dishType.join(', ');
    recipeObj.mealTypeString = recipeObj.mealType.join(', ');
    recipeObj.cuisineTypeString = recipeObj.cuisineType.join(', ');
      for (const property in recipeObj.totalNutrients) {
        recipeObj.totalNutrients[property].quantity = Math.round(recipeObj.totalNutrients[property].quantity)
      }
 }

  module.exports = { cleanRecipeListInfo, cleanRecipeObjInfo };