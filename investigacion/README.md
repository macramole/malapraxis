#Archivos de investigación de Mala Praxis 2015 - Universidad Nacional de Tres De Febrero

## Requerimientos
- [node.js](http://nodejs.org/) (uso 5.1.0)
- [mongodb](www.mongodb.org) (uso 3.0.7)
- lo que diga el package.json (hacer $npm install)


## Archivos

### csvToDB.js

Se le pasa el path a un archivo csv y el nombre del grupo y lo guarda en la base

### allCSVToDB.js

[DEPRECATED] Se fija en el directorio data los csv y los guarda en la base de datos Mongo

### analizarPorPalabra.js

Hace el proceso principal. Agarra los caminos en la base y los compara todos contra todos.
Genera relacionesCaminos.json con la información pertinente.

### parseJSONtoD3Network.js

Parsea el JSON resultante de analizarPorPalabra.js y le cambia el formato a uno compatible con d3 para visualizarlo (es un .js que se incluye desde el HTML).

## Qué hacer

Cuando hay nuevas duplas lo que hay que hacer es:

1. Ejecutar csvToDB pasándole como parámetro el archivo CSV y el nombre del grupo. Si lo que se quiere es actualizar o cambiar un grupo primero borrarlo de la base*
2. Ejecutar analizarPorPalabra sin ningún parámetro. Esto procesará todas las duplas de todos los grupos. En el futuro estaría bueno que puedas elegir que grupo analizar. Esto generará una archivo .json con toda la data.

**Si lo que se quiere hacer es luego visualizarlo por web:**

3. Ejecutar parseJSONtoD3Network. Desde el git esta linkeado (ln -s) desde visualizacion/web este archivo así no habría que hacer mas que abrir el index.html desde Chrome o Firefox.

**Para borrar un grupo de la base de datos:**

Usar un programa tipo [Robomongo](http://robomongo.org/) o directamente la shell de mongo.

Ver en la colección grupos el ObjectId del grupo que queramos borrar. Y mandar:

```
db.caminos.remove({ grupo : ObjectId("<el_id>") })
db.grupos.remove({ _id : ObjectId("<el_id>") })
```

Se puede tirar find en vez de remove para checkear bien que estamos borrando lo que queremos.
