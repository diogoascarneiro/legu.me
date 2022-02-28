$(document).ready(function () { 

    const favButton = $("#markFavourite");
    const currentPath = window.location.pathname;

   let isFavourite = false;

    favButton.on("click", ()=> {
        favButton.toggleClass("notFavRecipe").toggleClass("isFavRecipe");

        if (favButton.hasClass("isFavRecipe")) {
            favButton.text("♥ Favourite Recipe");
            isFavourite = true;
        }
        if (favButton.hasClass("notFavRecipe")) {
            favButton.text("♡ Mark this recipe as favourite");
            isFavourite = false;
        }

        $.ajax({
            url: currentPath,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                isFavourite
            }),
            success: (response) => {
              console.log("Ya did it")
            },
          });
    });

    

});