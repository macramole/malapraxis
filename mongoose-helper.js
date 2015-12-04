var mongoose = require('mongoose');
var async = require("async");
var logger = require("./logger.js");

module.exports = {
	saveParentAndChildren : function(modelParent, modelChild, jsonData, callback) {
	    var pathChildArrayName = '';
	    var pathParentIdName = '';

	    modelParent.schema.eachPath( function(pathName) {
	        var pathInfo = modelParent.schema.path(pathName);
	        if ( pathInfo.caster && pathInfo.caster.instance == 'ObjectID' && pathInfo.caster.options.ref == modelChild.modelName ) {
	            pathChildArrayName = pathInfo.caster.path;
	        }
	    });

	    if ( !pathChildArrayName ) {
	        callback("No path found for children array in parent model");
	        return;
	    }

	    modelChild.schema.eachPath( function(pathName) {
	        var pathInfo = modelChild.schema.path(pathName);
	        if ( pathInfo.instance == "ObjectID" && pathInfo.options.ref && pathInfo.options.ref == modelParent.modelName ) {
	            pathParentIdName = pathInfo.path;
	        }
	    });

	    if ( !pathParentIdName ) {
	        callback("No path found for parend id in child model");
	        return;
	    }

	    async.each(jsonData, function(jsonData, parentFinishCallback) {
	        var jsonChildren = jsonData[pathChildArrayName];
	        jsonData[pathChildArrayName] = [];

	        var oParent = new modelParent(jsonData);
	        oParent.save(function(err, oSavedParent) {
	            if ( err ) {
					parentFinishCallback(err);
	            } else {
	                async.each(jsonChildren, function(jsonChild, childFinishCallback) {
	                    jsonChild[pathParentIdName] = oSavedParent._id;

	                    var oChild = new modelChild(jsonChild);
	                    oChild.save(function(err, oSavedChild) {
	                        if ( err ) {
								childFinishCallback(err);
							} else {
								oSavedParent.caminos.push(oSavedChild._id);
								oSavedParent.save();
								//logger.debug("Child Saved");
								childFinishCallback();
							}
	                    });
	                }, function(err) {
	                    parentFinishCallback(err);
	                });
	            }
	        });
	    }, function(err) {
	        callback(err);
	    });
	},

	close : function() {
        mongoose.connection.close();
    }
};
