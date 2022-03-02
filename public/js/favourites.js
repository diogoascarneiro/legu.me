$(document).ready(function () { 

    const favButton = $("#markFavourite");
    const currentPath = window.location.pathname;

   let isFavourite = false;

    favButton.on("click", ()=> {
        favButton.toggleClass("notFavRecipe").toggleClass("isFavRecipe");

        if (favButton.hasClass("isFavRecipe")) {
            favButton.text("♥ Favourite");
            isFavourite = true;
        }
        if (favButton.hasClass("notFavRecipe")) {
            favButton.text("♡ Mark as favourite");
            isFavourite = false;
        }
        
        /* Saving this here for later because it might be possible to forgo the form on the .hbs and just do everything here through the ajax post */
        // $.ajax({
        //      url: currentPath,
        //      method: "POST",
        //      contentType: "application/json",
        //      data: JSON.stringify({
        //          isFavourite
        //      }),
        //      success: (response) => {
        //        console.log("Ya did it")
        //      },
        //    });
    });    

});





