var fs = require('fs');
var path = require('path');
var async = require('async');
var snake = require('./snake.js');
var jsdom = require('jsdom');
var mkdirp = require('mkdirp');
var document = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
var window = document.createWindow();

var contents_path = '../contents/';
contents_path = path.resolve(contents_path);
var img_path = contents_path + '/img/';

var figure_pages = fs.readdirSync(contents_path);
figure_pages = figure_pages.filter(function(figure_page) {
  return figure_page.indexOf('rubik') != -1;
});

async.forEachSeries(figure_pages, function(figure_page, callback) {
  var page_json = JSON.parse(fs.readFileSync(contents_path+'/'+figure_page).toString());

  var figures = [];
  for(p in page_json) {
    if(p.indexOf('figures') != -1) {
      figures = figures.concat(page_json[p]);
    }
  }
  var img_root = page_json.img_root;

  if (typeof figures != 'undefined' && figures.length > 0 && typeof img_root != 'undefined') {
    var output_path = img_path + img_root;
    console.log(output_path);
    mkdirp(output_path, function(err) {
      if (err) {
        console.error(err)
      }
      async.forEachSeries(figures, function(figure,callback) {
        var output = output_path + figure.filename;

        var renderer = snake.init(380, 380);
        snake.build(figure.data);

        var out = fs.createWriteStream(output);
        var stream = renderer.domElement.createPNGStream();

        stream.on('data', function(chunk) {
          out.write(chunk);
        });

        stream.on('end', function() {
          console.log('saved: ' + output);
          callback();
        });
      }, function(err) {
        callback();
      });
    });
  } else {
    callback('invalid syntax: ' + figure_page);
  }
}, function(err) {
  if(err) {
    console.log(err);
  }
  console.log("DONE!");
});