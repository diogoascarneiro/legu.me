const { Schema, model } = require("mongoose");

const recipeSchema = new Schema (
    {
       
          uri: String,
          label: String,
          image: String,
          images: {
            THUMBNAIL: {
              url: String,
              width: Number,
              height: Number
            },
            SMALL: {
              url: String,
              width: Number,
              height: Number
            },
            REGULAR: {
              url: String,
              width: Number,
              height: Number
            },
            LARGE: {
              url: String,
              width: Number,
              height: Number
            }
          },
          source: String,
          url: String,
          shareAs: String,
          yield: Number,
          dietLabels: [
            String
          ],
          
          healthLabels: [
            String
          ],
          cautions: [
            String
          ],
          ingredientLines: [
            String
          ],
          ingredients: [
            {
              text: String,
              quantity: Number,
              measure: String,
              food: String,
              weight: Number,
              foodId: String
            }
          ],
          calories: Number,
          glycemicIndex: Number,
          totalCO2Emissions: Number,
          co2EmissionsClass: String,
          totalWeight: Number,
          cuisineType: [
            String
          ],
          mealType: [
            String
          ],
          dishType: [
            String
          ],
          totalNutrients: {},
          totalDaily: {},
          digest: [
            {
              label: String,
              tag: String,
              schemaOrgTag: String,
              total: Number,
              hasRDI: Boolean,
              daily: Number,
              unit: String,
              sub: {}
            }
          ]
        }
      

)


const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;