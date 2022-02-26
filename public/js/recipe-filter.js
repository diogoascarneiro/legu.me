$(document).ready(function(){
    const filterForm = $("#recipe-filter");
    const recipeCardsContainer = $(".recipe-cards-container");
    
    const dietRestrictionsSelect = $("#dietary-restrictions-select");
    const dietRestrictionsFilterListElem = $("#dietary-restrictions-filter-list");
    let isFiltering = false;
    let dietRestrictionsListArr = [];
    
// See if the specific item is already in the array - if not, push it there, then add a new div with the name of the item and option to remove it

    dietRestrictionsSelect.change(() => {
        if (dietRestrictionsListArr.indexOf(dietRestrictionsSelect.val()) === -1) {
            dietRestrictionsListArr.push(dietRestrictionsSelect.val());
            dietRestrictionsFilterListElem.append(`<div class="${dietRestrictionsSelect.val()} btn remove-diet-restriction"> X | ${dietRestrictionsSelect.children("option:selected").text()}</div>`);
            isFiltering = true;
        }        
    });

// find the tag of the item to remove and then remove it from the array. NOTE: need to try to find another way to add this info to the element besides a class
    dietRestrictionsFilterListElem.on("click", ".remove-diet-restriction", (e)=> {
        let selectedOption = $(e.target).parent().attr("class");
        $(e.target).remove();
        dietRestrictionsListArr.splice(dietRestrictionsListArr.indexOf(selectedOption), 1);
        // This will break when we add more filters, just fyi
        if (dietRestrictionsListArr === 0) {isFiltering = false}
        });

    
    //Turn the 'apply filter' button into an ajax post request
    filterForm.on("submit", (e) => {
        e.preventDefault();
        
        $.ajax({
            url: '/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                 isFiltering,
                 healthLabels: {
                    $all: dietRestrictionsListArr
                }
            }),
            success: (response) => { 
                $(".card").remove();
                response.forEach((recipes) => {
                    recipeCardsContainer.append(`
                <div class="card m-1" style="width:24%">
                  <a href="#"><img class="card-img-top" src="${recipes.images.REGULAR.url}" alt="${recipes.label}"></a> 
                   <div class="card-body p-3">
                     <a class="card-title" href="#"><h6>${recipes.label}</h6></a> 
                     <p class="card-text">Calories: ${recipes.calories}</p>
                     <p>Source:</p>
                     <a href="${recipes.url}" class="btn btn-primary">${recipes.source}</a>
                     <a href="#makefavourite">♡</a>
                   </div>
                 </div>
                    `)
                })
                 }
        } );
    });

    
  });