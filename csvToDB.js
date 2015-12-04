var fs = require('fs');
var path = require('path');
var Lazy = require('lazy');
var db = require('./db.js');
var logger = require("./logger.js");
//logger.includeHeader = false;
logger.includeDate = false;

var DIR_DATA = "./data";
var CANT_CAMINOS_POR_PERSONA = 12;

fs.readdir(DIR_DATA, function(err, files) {
    var cantAnonimos = 0;
    var jsonData = {};

    files.forEach( function(file) {
        var numLinea = 0;
        var nombre;

        fs.readFileSync( path.resolve(DIR_DATA, file) )
            .toString()
            .split('\n')
            .forEach( function(line) {
                if ( line ) {
                    var arrLine = line.toString().split(',');
                    if ( numLinea == 0 ) {
                        nombre = arrLine[0];
                        if ( !nombre || nombre == "Anonimo" || nombre == "Anónimo" ) {
                            nombre = "anonimo_" + cantAnonimos;
                            cantAnonimos++;
                        }

                        jsonData[nombre] = {
                            "nombre"  : nombre,
                            observaciones : '',
                            caminos : []
                        }

                        var observaciones = arrLine[1];
                        if ( observaciones ) {
                            jsonData[nombre].observaciones = observaciones;
                        }
                    } else {
                        var arrPalabras = [];
                        arrLine.forEach( function(palabra, index) {
                            if ( palabra ) {
                                arrPalabras.push(palabra);
                            }
                        });

                        var comienzo = arrPalabras[0];
                        var final = arrPalabras.pop();

                        arrPalabras.splice(0, 1);

                        var camino = {
                            "comienzo" : comienzo,
                            "puente" : arrPalabras,
                            "final" : final,
                        }

                        jsonData[nombre].caminos.push(camino);
                    }

                    numLinea++;
                    if ( numLinea == CANT_CAMINOS_POR_PERSONA + 1 ) {
                        numLinea = 0;
                    }
                }
            } );
    });

    db.onOpened = function() {
        db.savePersonasYCaminos(jsonData, function(err) {
            if ( err ) {
                logger.error(err);
            } else {
                logger.info("Caminos guardados satisfactoriamente");
                db.close();
            }
        });
        db.close();
    };
});
