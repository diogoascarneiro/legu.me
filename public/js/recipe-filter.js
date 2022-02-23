$(document).ready(function(){
    const filterForm = $("#recipe-filter");
    const recipeListContainer = $(".recipe-list-container");
    

    const dietRestrictionsSelect = $("#dietary-restrictions-select");
    const dietRestrictionsFilterListElem = $("#dietary-restrictions-filter-list");
    let dietRestrictionsListArr = [];
    
// See if the specific item is already in the array - if not, push it there, then add a new div with the name of the item and option to remove it

    dietRestrictionsSelect.change(() => {
        if (dietRestrictionsListArr.indexOf(dietRestrictionsSelect.val()) === -1) {
            dietRestrictionsListArr.push(dietRestrictionsSelect.val());
            dietRestrictionsFilterListElem.append(`<div class="${dietRestrictionsSelect.val()}"><span class="remove-diet-restriction">X</span> <span class="remove-diet-restriction-value">${dietRestrictionsSelect.children("option:selected").text()}</p></div>`);
            console.log(dietRestrictionsListArr);
        }        
    });

// find the tag of the item to remove and then remove it from the array. NOTE: need to try to find another way to add this info to the element besides a class
    dietRestrictionsFilterListElem.on("click", "span.remove-diet-restriction", (e)=> {
        let selectedOption = $(e.target).parent().attr("class");
        $(e.target).parent().remove();
        dietRestrictionsListArr.splice(dietRestrictionsListArr.indexOf(selectedOption), 1);
        console.log(dietRestrictionsListArr);
        });

    // WIP - read https://www.freecodecamp.org/news/jquery-ajax-post-method/ and watch https://www.youtube.com/watch?v=Z-PmnpCTZ64
    //Turn the 'apply filter' button into an ajax post request
    filterForm.on("submit", (e) => {
        e.preventDefault();
        
        $.ajax({
            url: '/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({dietRestrictions: dietRestrictionsListArr}),
            success: (response) => { 
                $(".card").remove();
                response.forEach((recipes) => {
                    recipeListContainer.append(`
                    <div class="card" style="width:25%">
                    <img class="card-img-top" src="${recipes.recipe.images.THUMBNAIL.url}" alt="${recipes.recipe.label}">
                    <div class="card-body">
                      <h5 class="card-title">${recipes.recipe.label}</h5>
                      <p class="card-text">Calories: ${recipes.recipe.calories}</p>
                      <p>Source:</p>
                      <a href="${recipes.recipe.url}" class="btn btn-primary">${recipes.recipe.source}</a>
                      <a href="#makefavourite">♡</a>
                    </div>
                  </div>
                    `)
                })
                 }
        } );
    });

    
  });