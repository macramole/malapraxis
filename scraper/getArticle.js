var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Entities = require('html-entities').AllHtmlEntities;
var striptags = require('striptags');
var links = require('./links.json');
var entities = new Entities();
var PROTOURL = 'http://www.clarin.com';
var URL = PROTOURL + links[0].artLinks[0].href;


//helper for creating methods and bind them to dataTypes
Function.prototype.method = function(name, func) { //defino un método methodo
  if (!this.prototype[name]) {
    this.prototype[name] = func; //digo la funcion que le paso ahora puede ser accedida de todas las funciones
  }
  return this;
};
String.method('insert', function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
});
String.method('trim', function() {
  return this.replace(/^\s+|\s+$/g, '');
});


//----------------------------------------------------------------------------------------------------------------------------------------------------//

var newLiner = function(s, idx) {
  if (idx >= s.length) { //si se terminó el string
    fs.writeFileSync('art.txt', s);
    return;
  } else {
    //si no hay un espacio, movete un cachito
    if (s[idx] !== ' ') {
      newLiner(s, idx + 1);
    } else { //si no hay correla devuelta con la insersión en el index actual
      newLiner(s.insert(idx, 0, '\n'), idx + 100); //GUARDA, antes hacías idx * 2  ENTONCES haces exponential SHIT
    }
  }

};

//links[0].artLinks[0]
var parser = function($) {
  d = $('.nota').html();
  //formattedArticle = entities.decode(striptags(newLiner(d,100),''));
  //formattedArticle = ;
  newLiner(d, 100);
  //esta cabeceada la hago porque por alguna razón la función newLiner siempre me devuelve undefined
  var article = fs.readFileSync('art.txt').toString();
  fs.writeFileSync('art.txt', entities.decode(striptags(article), '').trim());

};
//callback
var gotResponse = function(err, data, body) {
  var $ = cheerio.load(body);
  parser($);
};

//DO
request(URL, gotResponse);
