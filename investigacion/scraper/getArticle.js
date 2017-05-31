var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var striptags = require('striptags');
var days = require('./links.json');
var PROTO_URL = 'http://www.clarin.com';
var TEST = "/entremujeres/familias_ensambladas_0_1334272266.html";
var rootDir = 'data/';
//console.log(año + mes + dia);
//iterando sobre elementos

var getArticle = function(filename) {
    return function(err, res, body) {
        //console.log(body);
        var text = " ";
        try {
            var $ = cheerio.load(body);
            var nota = $('.nota')['0'].children;
            nota.filter(function(elem) {
                return elem.type === 'tag';
            }).map(function(elem) {
                elem.children.filter(function(subElem) {
                    return subElem.data !== undefined;
                }).map(function(subElem) {
                    //console.log(subElem.data);
                    text += subElem.data;
                });
            });
            console.log("saving: " + filename);
            fs.writeFileSync(filename, text);
        } catch (e) {
            //console.log(elem);
            console.log("OOPS: " + e);
        }
    };

};
days.map(function(day) {
    //setting file and dir names
    var año = day.fecha.split('-')[2] + '/';
    var mes = day.fecha.split('-')[1] + '/';
    var dia = day.fecha.split('-')[0] + '/';
    if (!fs.existsSync(rootDir + año)) {
        fs.mkdirSync(rootDir + año);
    }
    if (!fs.existsSync(rootDir + año + mes)) {
        fs.mkdirSync(rootDir + año + mes);
    }
    if (!fs.existsSync(rootDir + año + mes + dia)) {
        fs.mkdirSync(rootDir + año + mes + dia);
    }
    day.links.map(function(link) {
        request(PROTO_URL + link.href, getArticle(rootDir + año + mes + dia + striptags(link.title) + '.txt'));
    });
});

//request(PROTO_URL + TEST,getArticle());
