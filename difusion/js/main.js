var CANT_IMAGENES = 59;
var CANT_IMAGENES_GRANDES = 10;
// var IMAGENES_GRANDES = [ 7, 18 ];

var cantImagesLoaded = 0;

$(function() {
    $('#fullpage').fullpage({
        scrollOverflow : true
    });

    var currentImagenGrande = 1;

    for ( var i = 1 ; i <= CANT_IMAGENES ; i++ ) {
        var $img = $("<img>").attr("src", "images/fotos/" + i + ".JPG");
        $("#imgs .wrapper").append($img);

        if ( i % ( Math.floor(CANT_IMAGENES/CANT_IMAGENES_GRANDES ) ) == 0 ) {
            if ( currentImagenGrande <= CANT_IMAGENES_GRANDES ) {
                var $imgGrande = $("<img>").attr("src", "images/fotos/grandes/" + currentImagenGrande + ".JPG");
                $imgGrande.addClass("grande");
                $("#imgs .wrapper").append($imgGrande);
                currentImagenGrande++;
            }
        }
    }
    for ( var i = 1 ; i <= Math.floor(CANT_IMAGENES / 2) - 2 ; i++ ) {
        var $img = $("<img>").attr("src", "images/fotos/" + i + ".JPG");
        $("#imgs .wrapper").append($img);
    }

    $('#imgs .wrapper').masonry({
      // options
      itemSelector: '#imgs .wrapper img',
      percentPosition: true,
      columnWidth : '.sizer'
    });
    //
    // $('#imgs .wrapper').imagesLoaded( function() {
    // });

    $('#imgs .wrapper').imagesLoaded()
         .always( function( instance ) {
             $('#imgs .wrapper').masonry('layout');
         })
        .progress( function( instance, image ) {
            cantImagesLoaded++;

            if ( cantImagesLoaded % 15 == 0 ) {
                $('#imgs .wrapper').masonry('layout');
            }
        });
    ;

    $("#imgs .wrapper").css("margin-top", $("header").outerHeight());
});

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
