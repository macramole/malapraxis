var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

var ROOT_URL = 'http://www.clarin.com/ediciones-anteriores/';
var UNTIL = "20160302";
var omitted = false;
var safetySave = 0;
//fecha inicial donde funciona este parser : 15 de Marzo de 2010


//get link list as it is
var newsLinks = JSON.parse(fs.readFileSync("links.json"));
//var newsLinks = [];

//---------------------------------------------DATE MANAGING---------------------------------------------------------//
var date = JSON.parse(fs.readFileSync("date.json"));
//know each month duration
var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
ceroer = function(num) { //agregame el cero cuando haga falta
    if (num < 10) {
        return '0' + num.toString();
    } else {
        return num.toString();
    }
};

var checkIfNewMonth = function() {
    if (date.d >= monthDays[date.m - 1]) {
        //set to cero because explicitly incremented
        date.d = 0;
        date.m++;
    } else {
        return;
    }
};
var checkIfNewYear = function() {
    if (date.m > 12) {
        date.m = 1;
        date.y++;
    }
};
var getDate = function() {
    return date.y.toString() + ceroer(date.m).toString() + ceroer(date.d).toString();
};


//-------------------------------------------------HANDLER-----------------------------------------------------------//

var getLinks = function() {
    return function(err, res, body) {
        if (err) {
            console.log(err);
        } else {
            var $ = cheerio.load(body);
            var day = {
                fecha: date.d.toString() + '-' + date.m.toString() + '-' + date.y.toString(),
                links: []
            };
            omitted = false;
            //parsing
            try {
                $('.items')['0'].children.filter(function(elem) {
                    return typeof elem.children !== "undefined"; //every other elem is not an array
                }).map(function(elem) {
                    elem.children.filter(function(subElem) {
                        return subElem.type === 'tag';
                    }).filter(function(subElem) {
                        return subElem.name === 'a';
                    }).map(function(subElem) {
                        day.links.push(subElem.attribs);
                    });
                });
            } catch (e) {
                console.log("OOPS: " + e.name + " me pa que no se agarraron links del ");
                console.log(date);
                omitted = true;
            }
            if (!omitted) {
                //ad day links to master array
                safetySave++;
                newsLinks.push(day);
                console.log(day);
            }
            //save every once in a while
            if (safetySave == 10) {
                fs.writeFileSync("date.json", JSON.stringify(date, null, ' '));
                fs.writeFileSync("links.json", JSON.stringify(newsLinks, null, ' '));
                safetySave = 0;
            }
            if (getDate() !== UNTIL) {
                //prepare for new day request
                checkIfNewMonth();
                checkIfNewYear();
                date.d++;
                console.log("new Day!");
                request(ROOT_URL + getDate(), getLinks());
            } else {
                //save when finished
                fs.writeFileSync("date.json", JSON.stringify(date, null, ' '));
                fs.writeFileSync("links.json", JSON.stringify(newsLinks, null, ' '));
                console.log("FINISHED");
            }
        }
    };
};

request(ROOT_URL + getDate(), getLinks());
