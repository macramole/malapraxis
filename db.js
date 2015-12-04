var logger = require("./logger.js");
var mongoose = require('mongoose');
var mongooseHelper = require('./mongoose-helper.js');

mongoose.connect('mongodb://localhost/malapraxis_investigacion');

var Camino;
var Persona;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  logger.debug("MongoDB anda");

  var caminosSchema = mongoose.Schema({
      comienzo : String,
      puente : [String],
      final : String,
      persona : { type: mongoose.Schema.Types.ObjectId, ref: "Persona" }
  });

  var personasSchema = mongoose.Schema({
    nombre : String,
  	observaciones : String,
    caminos : [{ type: mongoose.Schema.Types.ObjectId, ref: "Camino" } ]
  });

  var sinonimosSchema = mongoose.Schema({
    palabra : String,
    sinonimos : [String]
  });

  module.exports.Camino = mongoose.model('Camino', caminosSchema);
  module.exports.Persona = mongoose.model('Persona', personasSchema);
  module.exports.Sinonimo = mongoose.model('Sinonimo', sinonimosSchema);

  module.exports.onOpened();
});



module.exports = {
    Camino : null,
    Persona : null,
    Sinonimo : null,
    onOpened : function() {},

    savePersonasYCaminos : function(jsonData, finishCallback) {
        mongooseHelper.saveParentAndChildren(module.exports.Persona, module.exports.Camino, jsonData, finishCallback);
    },
    close : mongooseHelper.close
}
