var relaciones = require("./relaciones.js");

module.exports = {
	getRelacion : function(palabra1, palabra2, callback) {
		if ( palabra1 == palabra2 + "s" ) {

			callback(null, new relaciones.Relacion(relaciones.RELACION_IGUAL_PLURAL, palabra1) );
			return;
		}
		if ( palabra1 == palabra2 + "es" ) {
			callback(null, new relaciones.Relacion(relaciones.RELACION_IGUAL_PLURAL, palabra1));
			return;
		}
		if ( palabra1[ palabra1.length - 1 ] == "z" ) {
			var palabraPlural = palabra1.substr(0, palabra1.length - 1) + "ces";
			if ( palabraPlural == palabra2 ) {
				callback(null, new relaciones.Relacion(relaciones.RELACION_IGUAL_PLURAL, palabra1));
				return;
			}
		}
		if ( palabra2 == palabra1 + "s" ) {
			callback(null, new relaciones.Relacion(relaciones.RELACION_IGUAL_PLURAL, palabra1));
			return;
		}
		if ( palabra2 == palabra1 + "es" ) {
			callback(null, new relaciones.Relacion(relaciones.RELACION_IGUAL_PLURAL, palabra1));
			return;
		}
		if ( palabra2[ palabra2.length - 1 ] == "z" ) {
			var palabraPlural = palabra2.substr(0, palabra2.length - 1) + "ces";
			if ( palabraPlural == palabra1 ) {
				callback(null, new relaciones.Relacion(relaciones.RELACION_IGUAL_PLURAL, palabra1));
				return;
			}
		}

		callback(null, new relaciones.Relacion(relaciones.RELACION_SIN_RELACION));
	}
}
