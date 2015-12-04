var colors = require("colors");
var relaciones = require("./analisisPorPalabra/relaciones.js");

var COLOR_COMIENZO = "blue";
var COLOR_FINAL = COLOR_COMIENZO;
var COLOR_ID = "gray";
var COLOR_NO_RELEVANTE = "white";
var COLOR_OBSERVACION = "gray";

var COLORES_RELEVANTES = {
	1 : "green",
	2 : "red"
}

var SEPARATOR_PALABRA = " - ";

function printCamino(camino) {
	var strOut = "";
	strOut += camino.comienzo[COLOR_COMIENZO] + SEPARATOR_PALABRA;
	strOut += camino.puente.join(SEPARATOR_PALABRA);
	strOut += SEPARATOR_PALABRA + camino.final[COLOR_FINAL];

	if ( module.exports.showIds ) {
		var id = " (" + camino.id + ")"
		id = id[COLOR_ID];
		strOut += id;
	}

	return strOut;
}

function printCaminoRelacionado(camino, palabrasRelevantes) {
	var strOut = "-- ";
	camino.puente.forEach( function(palabraPuente, index) {
		var relacion = esPalabraRelevante(palabraPuente, palabrasRelevantes);

		if ( relacion.relacion > relaciones.RELACION_SIN_RELACION ) {
			strOut += palabraPuente[COLORES_RELEVANTES[relacion.relacion]];
			if ( relacion.observacion ) {
				var obs = " [" + relacion.observacion + "]";
				strOut += obs[COLOR_OBSERVACION];
			}
		} else {
			strOut += palabraPuente[COLOR_NO_RELEVANTE];
		}

		if ( index < camino.puente.length - 1 ) {
			strOut += SEPARATOR_PALABRA;
		}
	});

	if ( module.exports.showIds ) {
		var id = " (" + camino.id + ")";
		id = id[COLOR_ID];
		strOut += id;
	}

	return strOut;
}

function esPalabraRelevante(palabra, palabrasRelevantes) {
	var relacion = relaciones.RELACION_SIN_RELACION;

	palabrasRelevantes.forEach(function(palabraRelevante) {
		if ( palabraRelevante.palabra == palabra ) {
			relacion = palabraRelevante.relacion;
			return;
		}
	});

	return relacion;
}

module.exports = {
	showIds : true,
	printCamino : function(camino) {
		console.log( printCamino(camino) );
	},
	printCaminoRelacionado : function(camino, palabrasRelevantes) {
		console.log( printCaminoRelacionado(camino, palabrasRelevantes) );
	}
}
