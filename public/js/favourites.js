$(document).ready(function(){

const favouriteMeal = $("#favouriteButton");
const recipeLabel = $("#single-recipe-label");

favouriteMeal.on("click", (e) => {
    e.preventDefault();
    
    $.ajax({
        url: '/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
             
        }),
        success: (response) => { 
            
             }
             
    } );

});
})