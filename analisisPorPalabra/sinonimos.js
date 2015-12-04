var relaciones = require("./relaciones.js");
var sinonimos = require("./helpers/sinonimos.js");
var logger = require("../logger.js");

module.exports = {
	getRelacion : function(palabra1, palabra2, callback) {
		logger.debug("Buscando sinónimos para: " + palabra2);

		/*
		Algunas palabras eran tipo monagillo/a, saco lo de después de la barra
		para no tener problemas con los módulos de comparación
		*/
		if ( palabra2.indexOf("/") != -1 ) {
			palabra2 = palabra2.substr(0, palabra2.indexOf("/"));
			logger.debug("Palabra cambiada a: " + palabra2);
		}

		var arrSinonimos = sinonimos.getSinonimos.sync(null, palabra2);

		if ( arrSinonimos.length ) {
			//logger.debug(arrSinonimos.length + " Sinónimos encontrados: " + arrSinonimos);

			arrSinonimos.forEach( function(sinonimo) {
				if ( palabra1 == sinonimo ) {				
					callback(null, new relaciones.Relacion(relaciones.RELACION_SINONIMO, sinonimo));
					return;
				}
			});
		} else {
			//logger.debug("No se han encontrado sinonimos");
		}

		callback(null, relaciones.RELACION_SIN_RELACION);
	}
};
