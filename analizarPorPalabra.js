var db = require("./db.js");
var logger = require("./logger.js");
var ui = require("./cli_ui.js");
var relaciones = require("./analisisPorPalabra/relaciones.js");
var Sync = require("sync");
var fs = require("fs");

logger.setLogFile("logger.log");
logger.showDebug = false;

var FILENAME_CAMINO_GENERADO = "caminoGenerado.json";

/*
	Punteo:
	. Ordenar de mayor a menor cantidad de coincidencias (o niveles)
	. Módulo palabras parecidas por letras y posición ej: Estudiar - Estudios (==Estudi)
*/

db.onOpened = function() {
	db.Camino.find({}, function(err, caminos) {
		Sync( function() {
			caminos.forEach(function(camino) {
				var currentCamino = camino;
				ui.printCamino(currentCamino);
				relaciones.addCamino(currentCamino);
				caminos.forEach(function(camino) {
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

			var caminosGuardados = relaciones.getCaminosGuardados();
			logger.info( caminosGuardados );
			fs.writeFile(FILENAME_CAMINO_GENERADO, JSON.stringify(caminosGuardados), function (err) {
				if (err) logger.error(err);
				db.close();
	        });
		});
		//var util = require("util");
		//console.log(util.inspect(relaciones.getCaminosGuardados(), false, null));

	});
};
