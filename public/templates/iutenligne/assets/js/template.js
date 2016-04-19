// ------------------------------------------------------------------------------    
//menu toggle

$("#menu-toggle").click(function(e){
     e.preventDefault();
     $("#wrapper").toggleClass("toggled"); 
     $("#icone-menu").removeClass('none').addClass('block');
});
$("#menu-bars").click(function(e){
     e.preventDefault();$("#wrapper").toggleClass("toggled"); 
     $("#icone-menu").removeClass('block').addClass('none');
});

// ------------------------------------------------------------------------------    
//link chevron