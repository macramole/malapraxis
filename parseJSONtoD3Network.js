var fs = require("fs");
var logger = require("./logger");

var FILE_OUT = "./visualizacion/d3network.json";

var jsonIn = fs.readFileSync("relacionesCaminos.json", { encoding : "utf-8" });
jsonIn = JSON.parse(jsonIn);
var jsonOut = {
	nodes : {},
	links :{}
};
var indexAndId = {};

function limpiarCategoria(cat) {
	cat = cat.trim().toLowerCase().replace('"','').replace('"','');
	return cat;
}

//calcula la fuerza del vínculo
var MAXIMA_FUERZA = 2;
function calcularFuerza(caminosRelacionados) {
	var fuerza = 0;
	caminosRelacionados.puente.forEach( function( palabra ) {
		if ( typeof palabra == "object" ) {
			fuerza += (MAXIMA_FUERZA + 1) - palabra.relacion.relacion;
		}
	} );

	return fuerza;
}
function getPalabrasRelacionadas(caminosRelacionados) {
	var palabrasRelacionadas = [];
	caminosRelacionados.puente.forEach( function( palabra ) {
		if ( typeof palabra == "object" ) {
			palabrasRelacionadas.push(palabra);
		}
	} );

	return palabrasRelacionadas;
}

jsonIn.forEach( function(parent, index) {
	var categoria = limpiarCategoria(parent.camino.comienzo);
	parent.camino.cantRelaciones = parent.caminosRelacionados.length;

	jsonOut.nodes[categoria] = jsonOut.nodes[categoria] ? jsonOut.nodes[categoria] : [];
	jsonOut.nodes[categoria].push(parent.camino);

	indexAndId[categoria] = indexAndId[categoria] ? indexAndId[categoria] : [];
	indexAndId[categoria][parent.camino.id] = jsonOut.nodes[categoria].length - 1;
});

jsonIn.forEach( function(parent, index) {
	var categoria = limpiarCategoria(parent.camino.comienzo);
	parent.caminosRelacionados.forEach( function(caminoRelacionado) {
		jsonOut.links[categoria] = jsonOut.links[categoria] ? jsonOut.links[categoria] : [];
		jsonOut.links[categoria].push({
			source : indexAndId[categoria][parent.camino.id],
			target : indexAndId[categoria][caminoRelacionado.id],
			strength : calcularFuerza(caminoRelacionado),
			palabras : getPalabrasRelacionadas(caminoRelacionado)
		});
	});
});

fs.writeFileSync(FILE_OUT, JSON.stringify(jsonOut));
