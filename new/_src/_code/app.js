(function() {
  var fs = require('fs');
  var path = require('path');

  var async = require('async');
  var mkdirp = require('mkdirp');
  var Canvas = require('canvas');
  var THREE = require('three');
  var SpriteBuilder = require('node-spritesheet').Builder;

  var snake = require('./snake.js');

  var ratio = 16 / 9.0;

  var canvasWidth = 1024;
  var canvasHeight = Math.round(1024 / ratio);

  window = {
    innerWidth: canvasWidth,
    innerHeight: canvasHeight

  };
  document = {
    createElement: function(name) {
      if (name == "canvas") {
        return new Canvas(canvasWidth, canvasHeight);
      }
    }
  };

  var contents_path = '../contents/';
  contents_path = path.resolve(contents_path);
  var img_path = contents_path + '/img/';

  var figure_pages = fs.readdirSync(contents_path);
  figure_pages = figure_pages.filter(function(figure_page) {
    return figure_page.indexOf('rubik') != -1;
  });

  var render = function(output_path, figure, retina, callback) {
    var size = 356;
    var output;
    var renderer;
    if (retina) {
      output = output_path + figure.filename.replace(/\.png/, '@2x.png');
      renderer = snake.init(size * 2, size * 2);
    } else {
      output = output_path + figure.filename;
      renderer = snake.init(size, size);
    }
    snake.build(figure.data, figure.rotation);

    var fs = require('fs');
    var out = fs.createWriteStream(output);
    var stream = renderer.domElement.pngStream();

    stream.on('data', function(chunk) {
      out.write(chunk);
    });

    stream.on('end', function() {
      out.end(function() {
        console.log('saved: ' + output);
        callback();
      });
    });
  };

  var sprite = function(output_path, figures, callback) {
    var path_components = output_path.split(path.sep);
    var page = 'sprite';
    for (var i = path_components.length - 1; i >= 0; i--) {
      if (path_components[i] !== '') {
        page = path_components[i];
        break;
      }
    }

    outputs = async.map(figures, function(figure, callback_path) {
      return callback_path(null, output_path + figure.filename);
    }, function(err, results) {
      var builder = new SpriteBuilder({
        outputDirectory: path.resolve(img_path, 'figures'),
        outputCss: page + '.css',
        selector: '.figure.' + page
      });

      retina_results = results.map(function(result) {
        return result.replace(/\.png/, '@2x.png');
      });
      console.log(retina_results);

      builder.addConfiguration('legacy', {
        pixelRatio: 1,
        outputImage: page + '.png',
        images: results
      });

      builder.addConfiguration('retina', {
        pixelRatio: 2,
        outputImage: page + '@2x.png',
        images: retina_results
      });

      builder.build(function() {
        results.forEach(function(result) {
          if (fs.existsSync(result)) {
            fs.unlinkSync(result);
          }
        });
        fs.rmdirSync(output_path);
        callback();
      });
    });
  };

  async.forEachSeries(figure_pages, function(figure_page, callback_page) {
    var page_json = JSON.parse(fs.readFileSync(contents_path + '/' + figure_page).toString());

    var figures = [];
    for (var p in page_json) {
      if (p.indexOf('figures') != -1) {
        figures = figures.concat(page_json[p]);
      }
    }
    var img_root = page_json.img_root;

    if (typeof figures != 'undefined' && figures.length > 0 && typeof img_root != 'undefined') {
      var output_path = img_path + img_root;
      mkdirp(output_path, function(err) {
        if (err) {
          console.error(err);
        }
        async.forEachSeries(figures, function(figure, callback_image) {
          render(output_path, figure, false, function() {
            // render(output_path, figure, true, callback_image);
            callback_image();
          });
        }, function(err) {
          callback_page();
          // sprite(output_path, figures, callback_page);
        });
      });
    } else {
      callback_page('invalid syntax: ' + figure_page);
    }
  }, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("DONE!");
  });
}());