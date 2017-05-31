#!/usr/bin/node
var db = require("./db.js");
var logger = require("./logger.js");
var ui = require("./cli_ui.js");
var relaciones = require("./analisisPorPalabra/relaciones.js");
var Sync = require("sync");
var fs = require("fs");
var mongoose = require('mongoose');

logger.setLogFile("logger.log");
logger.showDebug = false;

var FILENAME_CAMINO_GENERADO = "caminoGenerado.json";
var cantTermino = 0;
var grupos;
var currentGrupoIndex = 0;
/*
	Punteo:
	. Ordenar de mayor a menor cantidad de coincidencias (o niveles)
*/

var analizar = function (grupo, callback) {
	// console.log(grupo.id);
	db.Camino.find({ grupo : grupo.id }).populate("grupo", "nombre").exec( function(err, caminos) {
		// console.log("b");
		Sync( function() {
			caminos.forEach(function(camino) {

				var currentCamino = camino;
				ui.printCamino(currentCamino);
				relaciones.addCamino(currentCamino);
				caminos.forEach(function(camino) {
					// console.log(camino);
					// process.exit(1);
					if ( camino != currentCamino ) {
						if ( camino.comienzo == currentCamino.comienzo && camino.final == currentCamino.final ) {
							var palabrasRelacionadas = [];
							camino.puente.forEach( function(palabraPuente) {
								currentCamino.puente.forEach( function(currentPalabraPuente) {
									try {
										var currentRelacion = relaciones.getRelacion.sync(null, currentPalabraPuente, palabraPuente);

										if ( currentRelacion.relacion > relaciones.RELACION_SIN_RELACION ) {
											palabrasRelacionadas.push({
												palabra : palabraPuente,
												relacion : currentRelacion
											});
										}
									} catch(err) {
										logger.error(err);
									}
								} );
							});
							if ( palabrasRelacionadas.length > 0 ) {
								ui.printCaminoRelacionado(camino, palabrasRelacionadas);
								relaciones.addCaminoRelacionado(camino, palabrasRelacionadas);
							}
						}
					}
				});
			});
			// logger.info("ya");
			callback();
		});
		//var util = require("util");
		//console.log(util.inspect(relaciones.getCaminosGuardados(), false, null));
	});
}

function termino() {
	currentGrupoIndex++;

	if ( currentGrupoIndex == grupos.length ) {

		var caminosGuardados = relaciones.getCaminosGuardados();
		// logger.info( caminosGuardados );
		fs.writeFile(FILENAME_CAMINO_GENERADO, JSON.stringify(caminosGuardados), function (err) {
			if (err) logger.error(err);
			logger.info(FILENAME_CAMINO_GENERADO + " generado.");
			db.close();
		});
	} else {
		analizarGrupos();
	}
};

function analizarGrupos() {
	logger.info("Analizando grupo " + currentGrupoIndex);
	analizar(grupos[currentGrupoIndex], termino);
}

db.onOpened = function() {
	db.Grupo.find({}, function(err, docGrupos) {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
		grupos = docGrupos;
		analizarGrupos();
	});
};
