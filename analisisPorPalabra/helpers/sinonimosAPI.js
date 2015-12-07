var http = require("http");
var querystring = require("querystring");
// var access_key = "UHPzAbyyBRb52GA5S3lyo1kBDkca";
var access_key = "ZrpPWSkGGdOE9yc7Yf_oC1ghEpIa";
var logger = require("../../logger.js");

var SLEEP_TIME_API_503 = 16000;
var SLEEP_TIME_API = 2000;

module.exports = {
	getSinonimo : function(palabra, callback) {
		logger.debug("Buscando en la API de sinónimos la palabra " + palabra);

		var req = http.request({
			host : "store.apicultur.com",
			path : "/api/sinonimosporpalabra/1.0.0/" + querystring.escape(palabra),
			method : "GET",
			headers : {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + access_key
			}

		}, function(res) {
			//logger.debug('STATUS: ' + res.statusCode);
			//logger.debug('HEADERS: ' + JSON.stringify(res.headers));

			if ( res.statusCode != 200 ) {
				if ( res.statusCode != 503 ) {
					callback("STATUS debería ser 200, es: " + res.statusCode, []);
					return;
				} else {
					logger.error("STATUS es 503, reintentando en " + SLEEP_TIME_API_503 + "ms...");
					setTimeout(function() {
						module.exports.getSinonimo(palabra, callback);
					}, SLEEP_TIME_API_503);
					return;
				}
			}

			// esto es normal, lo devuelve cuando no hay sinónimos (aparentemente)
			if ( res.headers["content-type"] == "text/plain" ) {
				setTimeout(function() {
					callback(null, []);
				}, SLEEP_TIME_API);
				return;
			}

			if ( res.headers["content-length"] == "0" ) {
				setTimeout(function() {
					callback(null, []);
				}, SLEEP_TIME_API);
			} else {
				var rawData = '';
				res.setEncoding('utf8');
				res.on("data", function(chunk) {
					rawData += chunk;
				});
				res.on("end", function() {
					try {
						var jsonData = JSON.parse(rawData);
						//logger.debug(jsonData);
						var sinonimos = [];

						jsonData.forEach(function(jsonPalabra) {
							sinonimos.push(jsonPalabra.valor);
						});
						//console.log(sinonimos);

						setTimeout(function() {
							callback(null, sinonimos);
						}, SLEEP_TIME_API);
					} catch (e) {
						callback("Data inválida, no se puede parsear",[]);
					}
				});
			}
		});

		req.on("error", function(e) {
			logger.error("Error en request " + e);
			callback(e, []);
		});

		req.end();
	}
}
