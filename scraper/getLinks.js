var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var PROTOURL = 'http://www.clarin.com/ediciones-anteriores/';
var TODAY = 20160202;
//var TODAY = 20100320;

//TODO:
//{ [Error: read ECONNRESET] code: 'ECONNRESET', errno: 'ECONNRESET', syscall: 'read' }
//cargar json y appendear
//------------------------------------------------------------------------------------------------------------------------------------------------------------------//


var constructDate = function() {
  //fecha inicial donde funciona este parser : 15 de Marzo de 2010
  var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    ceroer = function(num) { //agregame el cero cuando haga falta
      if (num < 10) {
        return '0' + num.toString();
      } else {
        return num.toString();
      }
    },
    getInt = function(obj) {
      var intedObj = {};
      for (var prop in obj) {
        intedObj[prop] = parseInt(obj[prop]);
      }
      return intedObj;

    };


  return {
    setDay: function(date) {
      date = getInt(date);
      if (date.day >= monthDays[date.month - 1]) {
        date.day = 0;
      }
      date.day++;
      return ceroer(date.day);
    },
    setMonth: function(date) {
      date = getInt(date);
      if (date.month === 12) {
        date.month = 0;
      }
      if (date.day === 1) {
        date.month++;
      }
      return ceroer(date.month);
    },
    setYear: function(date) {
      date = getInt(date);
      if (date.month === 1) {
        date.year++;
      }
      return date.year;
    },
    getDate: function(day,month,year) {
      var formatedDate = year.toString() + month.toString() + day.toString();
      console.log(formatedDate);
      return formatedDate;
    }
  };
}();


//---------------------------------------------------------------------------------------------------------------------------------------------//
var getInitDate = function() {
  return {
    day: fs.readFileSync('lastDay.txt').toString().slice(6, 8),
    month: fs.readFileSync('lastDay.txt').toString().slice(4, 6),
    year: fs.readFileSync('lastDay.txt').toString().slice(0, 4)
  };
};
var constructUrl = function() {
  return PROTOURL + constructDate.getDate(constructDate.setDay(getInitDate()), constructDate.setMonth(getInitDate()), constructDate.setYear(getInitDate()));
};
console.log(constructUrl());
console.log(constructUrl());
console.log(constructUrl());
//con esto tengo lista de links del día, pero no los que aparecen cuando se expande la lista
var parser = function($) {
  result = [];

  d = $('.items')['0'].children;
  for (var i = 1; i < d.length; i += 2) {
    var d2 = d[i].children; //cada noticia
    for (var x = 0; x < d2.length; x++) {
      if (d2[x].type === 'tag') {
        if (d2[x].name === 'a') {
          result.push(d2[x].attribs);
        }
      }
    }

  }
  return result;
};

var finalObjs = JSON.parse(fs.readFileSync('links.json'));

var gotResponse = function(err, data, body) {
  var d = {};
  var omitOnEmpty = false;
  if (err) {
    console.log(err);
    if (err.code === 'ECONNRESET') {
      console.log("connection resef because of manija.");
      console.log("Waiting one minute...");
      console.log("saving por las dudas...");
      fs.writeFileSync("links.json", JSON.stringify(finalObjs, null, ' '));
      setTimeout(request(constructUrl(), gotResponse), 1000 * 60);

    }
  } else {
    var $ = cheerio.load(body);
    var readableDate = data.request.uri.href.split('/')[4];
    readableDate = readableDate.slice(6, 8) + '-' +
      readableDate.slice(4, 6) + '-' + readableDate.slice(0, 4);
    d.fecha = readableDate;
    try {
      d.artLinks = parser($);
    } catch (e) {
      console.log("OOPS: " + e.name + " me pa que no se agarraron links del " + readableDate);
      omitOnEmpty = true;
    }
    if (!omitOnEmpty) {
      finalObjs.push(d);
    }
    if (data.request.uri.href.split('/')[4] != TODAY) {
      if(readableDate.split('-')[0] == 01){
        console.log("new month, so backup...");
        fs.writeFileSync("links.json", JSON.stringify(finalObjs, null, ' '));

      }
      fs.writeFileSync('lastDay.txt', data.request.uri.href.split('/')[4]);
      request(constructUrl(), gotResponse);

    } else {
      fs.writeFileSync("links.json", JSON.stringify(finalObjs, null, ' '));
      return "FINISHED";
    }
  }
};

//request(constructUrl(), gotResponse);
