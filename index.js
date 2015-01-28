/*
 * xml2html
 * Simple XML to HTML table parser
 *
 * https://github.com/mandrean/xml2html
 *
 * Copyright (c) 2015 Sebastian Mandrean
 * Licensed under the MIT license.
 */

/*jslint node:true*/
module.exports = function (params) {

  'use strict';

  var fs = require('fs'),
      cheerio = require('cheerio'),
      traverse = require('traverse'),
      xml2js = require('xml2js'),
      tidy = require('htmltidy').tidy,

      $ = cheerio.load('<html><table></table></html>');

  function saveHtml(output, html) {
    var opts = {
        'doctype':'html5',
        'tidy-mark':false,
        'indent':true
    }
    tidy(html, opts, function(err, tidyHtml) {
      if (err) throw err;
      console.log('Tidied up HTML!');
      fs.writeFile(output, tidyHtml, function (err) {
        if (err) throw err;
        console.log('Saved HTML!');
      });
    });
  }

  function array2html(array, callback) {
    for (var i=0, len=array.length; i<len; i++) {
      $('table').append('<tr><td>' + array[i][0] + '</td><td>' + array[i][1] + '</td></tr>');
    }
    callback(params.output, $.html());
  }

  function json2array(json, callback) {
    var array = traverse(json).reduce(function (acc) {
        if (this.notRoot && this.isLeaf) {
          acc.push([this.parent.key, this.node]);
        }
        return acc;
    }, []);
    callback(array, saveHtml);
  }

  function xml2json(input, callback) {
    var parser = new xml2js.Parser();
    var parsedXml;
    fs.readFile(input, function(err, data) {
        parser.parseString(data, function (err, result) {
          if (err) {
            console.log('Error parsing XML')
          } else {
            callback(result, array2html);
          }
        });
      });
  }

  xml2json(params.input, json2array);

};
