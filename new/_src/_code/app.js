var fs = require('fs');
var async = require('async');
var snake = require('./snake.js');
var jsdom = require('jsdom');
var document = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
var window = document.createWindow();


var figures = JSON.parse(fs.readFileSync('../contents/rubik_easy_de.json').toString()).figures;

async.forEachSeries(figures, function(figure, callback) {

  var renderer = snake.init(380, 380);
  snake.build(figure.data);

  var out = fs.createWriteStream('../contents/img/figures/easy/'+figure.filename);
  var stream = renderer.domElement.createPNGStream();

  stream.on('data', function(chunk) {
    out.write(chunk);
  })

  stream.on('end', function() {
    console.log('saved: ' + figure.filename)
    callback();
  });

}, function(err) {
  console.log('DONE!');
});
// var renderer = snake.init(500, 500);
// snake.build('10R2-10L2-8L2-7R2-5R2-5L2-2R2');


// var fs = require('fs')
//   , out = fs.createWriteStream(__dirname + '/text.png')
//   , stream = renderer.domElement.createPNGStream();

// stream.on('data', function(chunk){
//   out.write(chunk);
// });

// stream.on('end', function(){
//   console.log('saved png');
// });