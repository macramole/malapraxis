var db = require("../db.js");
var logger = require("../logger.js");
var fs = require("fs");

db.onOpened = function() {
	var palabras = [];

	db.Camino.find({}, { comienzo : true, final: true, puente : true }, function(err, caminos) {
		caminos.forEach( function(camino) {
			camino.puente.forEach( function(palabra) {
				var cleanPalabra = palabra.toLowerCase().trim();

				// if ( cleanPalabra == camino.comienzo || cleanPalabra == camino.final ) {
				// 	logger.error(cleanPalabra);
				// }

				//No incluyo las palabras que tengan espacios
				if ( cleanPalabra.indexOf(" ") == -1 ) {
					if ( palabras.indexOf(cleanPalabra) == -1 ) {
						palabras.push(palabra);
					}
				}
			} );

			if ( palabras.indexOf(camino.comienzo) == -1 ) {
				palabras.push(camino.comienzo);
			}
			if ( palabras.indexOf(camino.final) == -1 ) {
				palabras.push(camino.final);
			}
		} );

		// console.log(palabras);
		console.log(palabras.length);
		fs.writeFileSync("palabras.txt", palabras.join("\n"));
		db.close();
	})
}
