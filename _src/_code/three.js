var Canvas = require('canvas');

var self = {};

var ratio = 16/9.0;

var canvasWidth = 1024;
var canvasHeight = Math.round(1024 / ratio);

var window = {
    innerWidth: canvasWidth,
    innerHeight: canvasHeight

};
var document = {
    createElement: function(name) {
        if (name == "canvas") {
//            console.log("Creating canvas " + canvasWidth + ", " + canvasHeight);
            return new Canvas(canvasWidth, canvasHeight);
        }
    }
};

//
// Add three.js source here :)
//

exports.THREE = THREE;