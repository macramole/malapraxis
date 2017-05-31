#!/usr/bin/node
var fs = require("fs");
var logger = require("./logger");

var FILE_OUT = "./visualizacion/d3network.js";
var FILE_IN = "caminoGenerado.json";

var jsonIn = fs.readFileSync(FILE_IN, { encoding : "utf-8" });
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

for ( var nombreGrupo in jsonIn ) {
	var grupo = jsonIn[nombreGrupo];
	grupo.forEach( function( parent, index ) {
		var categoria = limpiarCategoria(parent.camino.comienzo);
		parent.camino.cantRelaciones = parent.caminosRelacionados.length;

		jsonOut.nodes[categoria] = jsonOut.nodes[categoria] ? jsonOut.nodes[categoria] : {};
		jsonOut.nodes[categoria][nombreGrupo] = jsonOut.nodes[categoria][nombreGrupo] ? jsonOut.nodes[categoria][nombreGrupo] : [];
		jsonOut.nodes[categoria][nombreGrupo].push(parent.camino);

		indexAndId[categoria] = indexAndId[categoria] ? indexAndId[categoria] : {};
		indexAndId[categoria][nombreGrupo] = indexAndId[categoria][nombreGrupo] ? indexAndId[categoria][nombreGrupo] : {};
		indexAndId[categoria][nombreGrupo][parent.camino.id] = jsonOut.nodes[categoria][nombreGrupo].length - 1;
	});
}

// console.log(indexAndId)
fs.writeFileSync("indesAndID.json", JSON.stringify(indexAndId));
// process.exit(1);

for ( var nombreGrupo in jsonIn ) {
	var grupo = jsonIn[nombreGrupo];
	console.log(nombreGrupo);
	grupo.forEach( function( parent, index ) {
		var categoria = limpiarCategoria(parent.camino.comienzo);
		parent.caminosRelacionados.forEach( function(caminoRelacionado) {
			if ( !indexAndId[categoria][nombreGrupo][caminoRelacionado.id] && indexAndId[categoria][nombreGrupo][caminoRelacionado.id] !== 0 ) {
				logger.error(categoria);
				logger.error(nombreGrupo);
				logger.error("Camino relacionado no esta en indexAndId" + " (" + caminoRelacionado.id + ")");

			}

			jsonOut.links[categoria] = jsonOut.links[categoria] ? jsonOut.links[categoria] : {};
			jsonOut.links[categoria][nombreGrupo] = jsonOut.links[categoria][nombreGrupo] ? jsonOut.links[categoria][nombreGrupo] : [];
			var linkObj = {
				source : indexAndId[categoria][nombreGrupo][parent.camino.id],
				target : indexAndId[categoria][nombreGrupo][caminoRelacionado.id],
				strength : calcularFuerza(caminoRelacionado),
				palabras : getPalabrasRelacionadas(caminoRelacionado)
			};

			jsonOut.links[categoria][nombreGrupo].push(linkObj);
		});
	});
};

// fs.writeFileSync(FILE_OUT, JSON.stringify(jsonOut));
fs.writeFileSync(FILE_OUT, "var dataD3network = " + JSON.stringify(jsonOut));
