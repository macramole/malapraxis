csvToDB.js
==========

Se fija en el directorio data los csv y los guarda en la base de datos Mongo

analizarPorPalabra.js
=====================

Hace el proceso principal. Agarra los caminos en la base y los compara todos contra todos.
Genera relacionesCaminos.json con la información pertinente.

parseJSONtoD3Network.js
=======================

Parsea el JSON resultante de analizarPorPalabra.js y le cambia el formato a uno
compatible con d3 para visualizarlo.
