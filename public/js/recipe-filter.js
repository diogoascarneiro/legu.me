//import {cleanRecipeObjInfo} from "../../utils/recipe-data-cleaner.js";

$(document).ready(function () {

/*  BUGS / TO DO LIST FOR THIS SECTION: 
    - Selecting "all" on filter selects should clear the array and buttons, not add an "all" button;
    - need to import stuff for the "sweets" and "side dish" categories
    - Need to add the remaining filter fields;
    - Figure out how import works (or doesn't, in this case). Attempts commented above and below.
    - We only need this file on the homepage, so figure out how to include it besides on layout.hbs
*/

  

  const filterForm = $("#recipe-filter");
  const recipeCardsContainer = $(".recipe-cards-container");
  const loadMoreBtn = $("#load-next-results");
  const loadPrevBtn = $("#load-previous-results");

  const dietRestrictionsSelect = $("#dietary-restrictions-select");
  const dietRestrictionsFilterListElem = $("#dietary-restrictions-filter-list");

  const cuisineTypeSelect = $("#cuisine-select");
  const cuisineTypeSelectFilterListElem = $("#cuisine-filter-list");

  const mealTypeSelect = $("#meal-type-select");
  const mealTypeSelectFilterListElem = $("#meal-type-filter-list");

  const dishTypeSelect = $("#dish-type-select");
  const dishTypeSelectFilterListElem = $("#dish-type-filter-list");

  let dietRestrictionsListArr = [];
  let cuisineTypeArr = [];
  let dishTypeArr = [];
  let mealTypeArr = [];

  let isFiltering = false;
  let skipResults = 0;

  function checkIfFiltering() {
    if (dietRestrictionsListArr.length > 0 || cuisineTypeArr.length > 0 || dishTypeArr.length > 0 || mealTypeArr.length > 0) {
      isFiltering = true;
    } else {
      isFiltering = false;
    }
  }

  /* The function below tidies up some of the recipe data for the front-end. 
  Since it's also in the index.js, we need to consider making it it's own file to keep it DRY  */

function cleanRecipeInfo(dbQueryResponse) {
    dbQueryResponse.forEach((item) => {
      item.calories = Math.round(item.calories);
      item.dishTypeString = item.dishType.join(', ');
      item.cuisineTypeString = item.cuisineType.join(', ');
    });
  }

  function printRecipeCards(response) {
      cleanRecipeInfo(response);
    response.forEach((recipe) => {
        recipeCardsContainer.append(`
    <div class="card m-1" style="width:24%">
    <a href="/recipes/${recipe.label}"><img class="card-img-top" src="${recipe.images.LARGE.url}" alt="${recipe.label}"></a> 
     <div class="card-body p-3 d-flex flex-column justify-content-around">
       <a class="card-title" href="/recipes/${recipe.label}"><h6>${recipe.label}</h6></a> 
       <p class="card-text"><b>Type of dish:</b> <span class="capitalize">${recipe.dishTypeString}</span></p>
       <p class="card-text"><b>Cuisine:</b> <span class="capitalize">${recipe.cuisineTypeString}</span></p>
       <p class="card-text"><b>Calories:</b> ${recipe.calories}</p>
        <a href="${recipe.url}" class="btn source-btn">Source: ${recipe.source}</a>
       </div>
   </div>
   `)});
  }

  function noHitsMsg(reason) {
    if (reason === "filter") {
      recipeCardsContainer.append(`
      <div class="d-flex flex-column justify-content-center align-items-center w-100">
      <h3>No recipes fit these search terms. :(</h3><br>
      <img src="images/crying-kidney.png"> <br>
      <h4>Still need some culinary inspiration? Try searching again!</h4>
      </div>
      `);
    } else if (reason === "noMore") {
      recipeCardsContainer.append(`
      <div class="d-flex flex-column justify-content-center align-items-center w-100">
      <h3>No more recipes to display :(.</h3><br>
      <img src="images/crying-kidney.png"><br>
      <h4>Still need some culinary inspiration? Try searching again!</h4>
      </div>
      `)
    }
  }

  // See if the specific item is already in the array - if not, push it there, then add a new div with the name of the item and option to remove it

  dietRestrictionsSelect.change(() => {
    if (dietRestrictionsListArr.indexOf(dietRestrictionsSelect.val()) === -1) {
      dietRestrictionsListArr.push(dietRestrictionsSelect.val());
      dietRestrictionsFilterListElem.append(
        `<div class="${dietRestrictionsSelect.val()} btn remove-diet-restriction"> X | ${dietRestrictionsSelect.children("option:selected").text()}</div>`
      );
    }
  });

  // find the tag of the item to remove and then remove it from the array. NOTE: need to try to find another way to add this info to the element besides a class
  dietRestrictionsFilterListElem.on("click", ".remove-diet-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    dietRestrictionsListArr.splice(dietRestrictionsListArr.indexOf(selectedOption), 1);
  });

  dishTypeSelect.change(() => {
    if (dishTypeArr.indexOf(dishTypeSelect.val()) === -1) {
      dishTypeArr.push(dishTypeSelect.val());
      console.log("dishTypeArray :>> ", dishTypeArr);
      dishTypeSelectFilterListElem.append(
        `<div class="${dishTypeSelect.val()} btn remove-dishType-restriction"> X | ${dishTypeSelect.children("option:selected").text()}</div>`
      );
    }
  });

  dishTypeSelectFilterListElem.on("click", ".remove-dishType-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    dishTypeArr.splice(dishTypeArr.indexOf(selectedOption), 1);
  });

  cuisineTypeSelect.change(() => {
    if (cuisineTypeArr.indexOf(cuisineTypeSelect.val()) === -1) {
      cuisineTypeArr.push(cuisineTypeSelect.val());
      console.log("dishTypeArray :>> ", cuisineTypeArr);
      cuisineTypeSelectFilterListElem.append(
        `<div class="${cuisineTypeSelect.val()} btn remove-cuisineType-restriction"> X | ${cuisineTypeSelect.children("option:selected").text()}</div>`
      );
    }
  });

  cuisineTypeSelectFilterListElem.on("click", ".remove-cuisineType-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    cuisineTypeArr.splice(cuisineTypeArr.indexOf(selectedOption), 1);
  });

  mealTypeSelect.change(() => {
    if (mealTypeArr.indexOf(mealTypeSelect.val()) === -1) {
      mealTypeArr.push(mealTypeSelect.val());
      console.log("dishTypeArray :>> ", mealTypeArr);
      mealTypeSelectFilterListElem.append(
        `<div class="${mealTypeSelect.val()} btn remove-cuisineType-restriction"> X | ${mealTypeSelect.children("option:selected").text()}</div>`
      );
    }
  });

  mealTypeSelectFilterListElem.on("click", ".remove-cuisineType-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    mealTypeArr.splice(mealTypeArr.indexOf(selectedOption), 1);
  });

  //Turn the 'apply filter' button into an ajax post request
  filterForm.on("submit", (e) => {
    e.preventDefault();
    checkIfFiltering();
    $.ajax({
      url: "/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        isFiltering,
        healthLabels: {
          $all: dietRestrictionsListArr,
        },
        dishType: {
          $in: dishTypeArr,
        },
        cuisineType: {
          $in: cuisineTypeArr,
        },
        mealType: {
          $in: mealTypeArr,
        },
      }),
      success: (response) => {
        recipeCardsContainer.children().remove();
        if (response.length === 0) {
        noHitsMsg("filter");
        } else {
          printRecipeCards(response);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
    });
  });

  /* Use the load more and load previous buttons to... well, you know */

  function recipeListNavigation() {
    checkIfFiltering();
    $.ajax({
      url: "/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        skipResults,
        isFiltering,
        healthLabels: {
          $all: dietRestrictionsListArr,
        },
        dishType: {
          $in: dishTypeArr,
        },
        cuisineType: {
          $in: cuisineTypeArr,
        },
        mealType: {
          $in: mealTypeArr,
        },
      }),
      success: (response) => {
        recipeCardsContainer.children().remove();
        if (response.length === 0) {
            noHitsMsg("noMore");
          } else {
            printRecipeCards(response);
          }
      },
    });
  }

  loadMoreBtn.on("click", () => {
    skipResults += 12;
    recipeListNavigation();
  });

  loadPrevBtn.on("click", () => {
    skipResults -= 12;
    if (skipResults > 0) {skipResults = 0};
    recipeListNavigation();
  });
  
});
