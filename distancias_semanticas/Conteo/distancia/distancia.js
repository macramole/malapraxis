#!/usr/bin/node
var logger = require("./logger.js");
logger.includeDate = false;

var palabras = [ process.argv[2], process.argv[3] ];
if ( !palabras[0] || !palabras[1] || palabras[0] == palabras[1] ) { 
    logger.error("usage: distancia <palabra1> <palabra2>");
    logger.info("las palabras deben ser distintas");
    process.exit(1);
}

var fs = require("fs")

var FILE_INDICES = "../indices.txt";
var FILE_MATRIZ = "../Matriz.txt";

var rawIndices = fs.readFileSync(FILE_INDICES).toString().split("\n");
var indices = [];
rawIndices.forEach(function(line){
    var indice = line.split("\t");
    var posPalabra = palabras.indexOf(indice[1]);
    if ( posPalabra != -1 ) { 
        logger.debug( indice[1] + " es " + indice[0] );
        indices[posPalabra] = indice[0];
    }
});
if ( !indices[0] || !indices[1] ) {
    logger.error("No se encontraron indices para las palabras requeridas");
    process.exit(1);
}

var rawMatriz = fs.readFileSync(FILE_MATRIZ).toString().split("\n");
var datos = {
    "N(palabra2)" : null,
    "N(palabra1 u palabra2)" : null,
}

rawMatriz.forEach( function(line) { 
   var coocurrencia = line.split("\t");
   
   if ( coocurrencia[0] == coocurrencia[1] && coocurrencia[1] == indices[1]  ) {
       logger.debug("N(" + palabras[1] + ") = " + coocurrencia[2]);
       datos["N(palabra2)"] = coocurrencia[2];
   }
   if ( coocurrencia[0] == indices[0] && coocurrencia[1] == indices[1] ) {
       logger.debug("N(" + palabras[0] + " u " + palabras[1] + ") = " + coocurrencia[2]);
       datos["N(palabra1 u palabra2)"] = coocurrencia[2];
   }
});

if ( !datos["N(palabra2)"] ) {
    logger.error("No se encontró " + "N(" + palabras[1] + ")");
    process.exit(1);
}
if ( !datos["N(palabra1 u palabra2)"] ) {
    logger.error("No se encontró " + "N(" + palabras[0] + " u " + palabras[1] + ")");
    process.exit(1);
}

var distancia = datos["N(palabra2)"] / datos["N(palabra1 u palabra2)"];
console.log(distancia);

