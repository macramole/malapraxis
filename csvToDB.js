#!/usr/bin/node
var fs = require('fs');
var path = require('path');
var Lazy = require('lazy');
var db = require('./db.js');
var logger = require("./logger.js");
//logger.includeHeader = false;
logger.includeDate = false;

var CANT_CAMINOS_POR_PERSONA = 12;

var csvFile = process.argv[2];
var grupo = process.argv[3];

if ( !csvFile || !grupo ) {
    logger.error("usage: csvToDB <csvFile> <nombre_grupo>");
    logger.info("ejemplo: csvToDB micsv.csv \"4to 3era inicial\" ");
    process.exit(1);
}

var file;
try {
    file = fs.openSync(csvFile, 'r');
} catch (e) {
    logger.error("No encuentro el archivo CSV o no lo puedo abrir.");
    process.exit(1);
}

var cantAnonimos = 0;
var jsonData = {};
var numLinea = 0;
var nombre;

fs.readFileSync( file )
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
                    "nombre"  : grupo,
                    observaciones : '',
                    caminos : []
                }

                // var observaciones = arrLine[1];
                // if ( observaciones ) {
                //     jsonData[nombre].observaciones = observaciones;
                // }
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
                    "final" : final
                }

                jsonData[nombre].caminos.push(camino);
            }

            numLinea++;
            if ( numLinea == CANT_CAMINOS_POR_PERSONA + 1 ) {
                numLinea = 0;
            }
        }
    } );

db.onOpened = function() {
    // logger.info(jsonData);
    db.savePersonasYCaminos(jsonData, function(err) {
        if ( err ) {
            logger.error(err);
        } else {
            logger.info("Caminos guardados satisfactoriamente");
            db.close();
        }
    });
    // db.close();
};
