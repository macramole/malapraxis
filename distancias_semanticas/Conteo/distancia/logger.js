var colors = require('colors');
var strftime = require('strftime');
var fs = require("fs");

var HEADER_ERROR = {
    text : "[ERROR]",
    color : "red"
}
var HEADER_DEBUG = {
    text : "[DEBUG]",
    color : "yellow"
}
var HEADER_INFO = {
    text : "[INFO]",
    color : "green"
}
var HEADER_SPECIAL = {
    text : "[LOGGER]",
    color : "white"
}

function log(header, msg) {
    if ( typeof msg == "object" ) {
        msg = JSON.stringify(msg, null, '\t');
    }

    var logMessage = msg;
    var logMessageToFile = msg;

    if ( module.exports.includeHeader ) {
        logMessage = header.text[header.color] + " " + logMessage;
        logMessageToFile = header.text + " " + logMessageToFile;
    }

    if ( module.exports.includeDate ) {
        logMessage = "[" + strftime('%Y-%m-%d %H:%M:%S') + "] " + logMessage;
        logMessageToFile = "[" + strftime('%Y-%m-%d %H:%M:%S') + "] " + logMessageToFile;
    }

    if ( module.exports.logToConsole && header != HEADER_SPECIAL ) {
        if ( !(header == HEADER_DEBUG && !module.exports.showDebug) ) {
            console.log(logMessage)
        }
    }

    if ( module.exports.logToFile ) {
        fs.appendFile(module.exports.logToFile, logMessageToFile + "\n", function (err) {

        });
    }
}

module.exports = {
    includeHeader : true,
    includeDate : true,
    showDebug : true,

    logToConsole : true,
    logToFile : false,

    setLogFile : function(logFile) {
        module.exports.logToFile = logFile;
        log(HEADER_SPECIAL, "Logger initializing");
    },

    debug : function(msg) {
        log( HEADER_DEBUG, msg);
    },
    error : function(msg) {
        log( HEADER_ERROR, msg);
    },
    info : function(msg) {
        log( HEADER_INFO, msg);
    }
}
