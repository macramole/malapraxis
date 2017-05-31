var logger = require("../logger.js");
var modulosDeRelacion = ["plurales", "sinonimos"];
//var modulosDeRelacion = ["plurales"];
var relaciones = {};
var currentCamino = null;

module.exports = {
	RELACION_SIN_RELACION : 0,
	RELACION_IGUAL : 1,
	RELACION_IGUAL_PLURAL : 1,
	RELACION_SINONIMO : 2,

	Relacion : function(nivelRelacion, observacion) {
		this.relacion = nivelRelacion;
		this.observacion = observacion;
	},

	getRelacion : function (palabra1, palabra2, callback) {
		if ( palabra1 == palabra2 ) {
			callback(null, new module.exports.Relacion(module.exports.RELACION_IGUAL));
			return;
		}

		for ( var i = 0 ; i < modulosDeRelacion.length ; i++ ) {
			//logger.debug("Usando módulo: " + modulosDeRelacion[i]);
			try {
				var relacion = require("./" + modulosDeRelacion[i] + ".js").getRelacion.sync(null, palabra1, palabra2);

				if ( relacion.relacion != module.exports.RELACION_SIN_RELACION ) {
					callback(null, relacion);
					return;
				}
			} catch (e) {
				logger.error(e);
			}
		}

		callback(null, new module.exports.Relacion(module.exports.RELACION_SIN_RELACION));
	},

	addCamino : function(camino) {
		var uiCamino = {
			id : camino.id,
			comienzo : camino.comienzo,
			puente : camino.puente,
			final : camino.final,
			grupo : camino.grupo.nombre
		};

		currentCamino = {
			camino : uiCamino,
			caminosRelacionados : []
		};

		relaciones[camino.grupo.nombre] = relaciones[camino.grupo.nombre] ? relaciones[camino.grupo.nombre] : [];
		relaciones[camino.grupo.nombre].push(currentCamino);
	},

	addCaminoRelacionado : function(camino, palabrasRelevantes) {

		var uiCaminoRelacionado = {
			id : camino.id,
			puente : []
		};

		camino.puente.forEach(function(palabra, index) {
			palabrasRelevantes.forEach(function(palabraRelevante) {
				if ( palabraRelevante.palabra == palabra ) {
					uiCaminoRelacionado.puente.push( {
						palabra : palabra,
						relacion : palabraRelevante.relacion,
						observacion : palabraRelevante.observacion
					} );
				} else {
					if ( uiCaminoRelacionado.puente.indexOf(palabra) == -1 ) {
						uiCaminoRelacionado.puente.push( palabra );
					}
				}
			});
		});

		currentCamino.caminosRelacionados.push(uiCaminoRelacionado);
	},

	getCaminosGuardados : function() {
		return relaciones;
	}
}
