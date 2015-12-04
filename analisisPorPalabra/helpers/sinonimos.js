var logger = require("../../logger.js");
var db = require("../../db.js");
var api = require("./sinonimosAPI.js");
//var Sync = require("sync");

function saveSinonimo(palabra, sinonimos, callback) {
	db.Sinonimo.create({
		palabra : palabra,
		sinonimos : sinonimos
	}, function(err, dbPalabra) {
		callback(err);
	});

};

module.exports = {
	getSinonimos : function(palabra, callback) {
		db.Sinonimo.findOne({palabra : palabra}, function(err, dbPalabra) {
			if (err) logger.error(err);
			if ( dbPalabra ) {
				logger.debug(dbPalabra.sinonimos.length + " Sinónimos encontrados en la base de datos");
				callback(err, dbPalabra.sinonimos);
			} else {
				api.getSinonimo(palabra, function(err, sinonimos) {
					if ( err ) {
						logger.error(err);
						callback(null, [])
					} else {
						saveSinonimo( palabra, sinonimos, function(err) {
							if ( sinonimos.length ) {
								logger.debug(sinonimos.length + " Sinónimos encontrados por API");
							} else {
								logger.debug("No se encontraron sinónimos por API");
							}

							if (err) {
								logger.error(err);
							} else {
								logger.debug("Sinonimos grabados a la base de datos (" + palabra + ")");
							}

							callback(null, sinonimos);
						});
					}
				});
			}
		});
	}
}
