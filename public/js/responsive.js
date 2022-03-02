$(document).ready(function () { 

   /* Don't really have the time to build one of these by myself so I'm letting the internet help on this one. Thanks stack overflow!
      https://stackoverflow.com/questions/9828831/jquery-on-window-resize - adapted slightly for our needs
      Might try the option after the one below if there's still time!
   */
     
    var resizeDelay = 200;
    var doResize = true;
    let height = $(window).height();
    let width = $(window).width();

    var resizer = function () {
       if (doResize) {
 
        /*  Mobile changes */
        if ($(window).width() < 576) {
            $("#filter-accordion-collapse").removeClass("show");
        }

        if ($(window).width() > 576) {
            $("#filter-accordion-collapse").addClass("show");
        }
 
        
         doResize = false;
       }
     };
     var resizerInterval = setInterval(resizer, resizeDelay);
     resizer();
 
     $(window).resize(function() {
       doResize = true;
       height = $(window).height();
       width = $(window).width();
     });

});