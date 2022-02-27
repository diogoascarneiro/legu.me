$(document).ready(function () {
  const filterForm = $("#recipe-filter");
  const recipeCardsContainer = $(".recipe-cards-container");
  const loadMoreBtn = $("#load-next-results");

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

  function printRecipeCards(response) {
    response.forEach((recipe) => {
        recipeCardsContainer.append(`
    <div class="card m-1" style="width:24%">
    <a href="/recipes/${recipe.label}"><img class="card-img-top" src="${recipe.images.LARGE.url}" alt="${recipe.label}"></a> 
     <div class="card-body p-3 d-flex flex-column justify-content-around">
       <a class="card-title" href="/recipes/${recipe.label}"><h6>${recipe.label}</h6></a> 
       <p class="card-text">Type of dish: <span style="text-transform:capitalize">${recipe.dishTypeString}</span></p>
       <p class="card-text">Cuisine: <span style="text-transform:capitalize">${recipe.cuisineTypeString}</span></p>
       <p class="card-text">Calories: ${recipe.calories}</p>
        <a href="${recipe.url}" class="btn source-btn">Source: ${recipe.source}</a>
       </div>
   </div>
   `)});
  }

  // See if the specific item is already in the array - if not, push it there, then add a new div with the name of the item and option to remove it

  dietRestrictionsSelect.change(() => {
    if (dietRestrictionsListArr.indexOf(dietRestrictionsSelect.val()) === -1) {
      dietRestrictionsListArr.push(dietRestrictionsSelect.val());
      dietRestrictionsFilterListElem.append(
        `<div class="${dietRestrictionsSelect.val()} btn remove-diet-restriction"> X | ${dietRestrictionsSelect.children("option:selected").text()}</div>`
      );
      checkIfFiltering();
    }
  });

  // find the tag of the item to remove and then remove it from the array. NOTE: need to try to find another way to add this info to the element besides a class
  dietRestrictionsFilterListElem.on("click", ".remove-diet-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    dietRestrictionsListArr.splice(dietRestrictionsListArr.indexOf(selectedOption), 1);
    checkIfFiltering();
  });

  dishTypeSelect.change(() => {
    if (dishTypeArr.indexOf(dishTypeSelect.val()) === -1) {
      dishTypeArr.push(dishTypeSelect.val());
      console.log("dishTypeArray :>> ", dishTypeArr);
      dishTypeSelectFilterListElem.append(
        `<div class="${dishTypeSelect.val()} btn remove-dishType-restriction"> X | ${dishTypeSelect.children("option:selected").text()}</div>`
      );
      checkIfFiltering();
    }
  });

  dishTypeSelectFilterListElem.on("click", ".remove-dishType-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    dishTypeArr.splice(dishTypeArr.indexOf(selectedOption), 1);
    checkIfFiltering();
  });

  cuisineTypeSelect.change(() => {
    if (cuisineTypeArr.indexOf(cuisineTypeSelect.val()) === -1) {
      cuisineTypeArr.push(cuisineTypeSelect.val());
      console.log("dishTypeArray :>> ", cuisineTypeArr);
      cuisineTypeSelectFilterListElem.append(
        `<div class="${cuisineTypeSelect.val()} btn remove-cuisineType-restriction"> X | ${cuisineTypeSelect.children("option:selected").text()}</div>`
      );
      checkIfFiltering();
    }
  });

  cuisineTypeSelectFilterListElem.on("click", ".remove-cuisineType-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    cuisineTypeArr.splice(cuisineTypeArr.indexOf(selectedOption), 1);
    checkIfFiltering();
  });

  mealTypeSelect.change(() => {
    if (mealTypeArr.indexOf(mealTypeSelect.val()) === -1) {
      mealTypeArr.push(mealTypeSelect.val());
      console.log("dishTypeArray :>> ", mealTypeArr);
      mealTypeSelectFilterListElem.append(
        `<div class="${mealTypeSelect.val()} btn remove-cuisineType-restriction"> X | ${mealTypeSelect.children("option:selected").text()}</div>`
      );
      checkIfFiltering();
    }
  });

  mealTypeSelectFilterListElem.on("click", ".remove-cuisineType-restriction", (e) => {
    let selectedOption = $(e.target).parent().attr("class");
    $(e.target).remove();
    mealTypeArr.splice(mealTypeArr.indexOf(selectedOption), 1);
    checkIfFiltering();
  });

  //Turn the 'apply filter' button into an ajax post request
  filterForm.on("submit", (e) => {
    e.preventDefault();
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
        $(".card").remove();
        if (response.length === 0) {
          recipeCardsContainer.append("<h3>No recipes fit these search terms.</h3><br><h4>Still need some culinary inspiration? Try searching again!</h4>");
        } else {
          printRecipeCards(response);
        }
      },
    });
  });

  /* Use the load more button to... well, you know */
  loadMoreBtn.on("click", () => {
    skipResults += 12;
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
        $(".card").remove();
        if (response.length === 0) {
            recipeCardsContainer.append("<h3>No more recipes to display :(.</h3><br><h4>Still need some culinary inspiration? Try searching again!</h4>");
          } else {
            printRecipeCards(response);
          }
      },
    });
  });
});
