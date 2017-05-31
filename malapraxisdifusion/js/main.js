var CANT_IMAGENES = 47;
var IMAGENES_GRANDES = [ 7 ];

$(function() {
    $('#fullpage').fullpage({
        scrollOverflow : true
    });

    // $('#imgs .wrapper').masonry({
    //   // options
    //   itemSelector: '#imgs .wrapper img',
    //   percentPosition: true,
    //   columnWidth : '.sizer'
    // });

    for ( var i = 1 ; i <= CANT_IMAGENES ; i++ ) {
        var $img = $("<img>").attr("src", "images/fotos/" + i + ".JPG");
        $("#imgs .wrapper").append($img);

        if ( IMAGENES_GRANDES.indexOf(i) !== -1 ) {
            $img.addClass("grande");
        }
    }
    for ( var i = 1 ; i <= CANT_IMAGENES ; i++ ) {
        var $img = $("<img>").attr("src", "images/fotos/" + i + ".JPG");
        $("#imgs .wrapper").append($img);
    }

    $("#imgs .wrapper").css("margin-top", $("header").outerHeight());
});
