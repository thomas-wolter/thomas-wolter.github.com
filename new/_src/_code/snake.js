/*global require, exports */

(function(exports) {

  var THREE = require('three');

  var renderer, scene, camera;
  var geometryEven, geometryOdd, materialEven, materialOdd;
  var prisms = [];
  var figure;

  var humanNotationToComputer = {
    '1R': 0,
    '2L': 1,
    '2R': 2,
    '3L': 3,
    '3R': 4,
    '4L': 5,
    '4R': 6,
    '5L': 7,
    '5R': 8,
    '6L': 9,
    '6R': 10,
    '7L': 11,
    '7R': 12,
    '8L': 13,
    '8R': 14,
    '9L': 15,
    '9R': 16,
    '10L': 17,
    '10R': 18,
    '11L': 19,
    '11R': 20,
    '12L': 21,
    '12R': 22
  };

  function parseNotation(humanNotation) {
    var instructions = humanNotation.split(/-/g);

    var computerNotation = [];
    for (var i = 0; i < 24; i++) {
      computerNotation.push(0);
    }
    instructions.forEach(function(instruction) {
      var split_index = instruction.search(/R|L/);

      var position = instruction.substring(0, split_index + 1);
      var side = instruction.substring(split_index, split_index + 1);
      var orientation = parseInt(instruction.substring(split_index + 1, instruction.length), 10);

      if (side === 'R') {
        if (orientation === 1) {
          orientation = 3;
        } else if (orientation === 3) {
          orientation = 1;
        }
      }

      if (position.length !== 0 && side.length !== 0 && !isNaN(orientation)) {
        computerNotation[humanNotationToComputer[position]] = orientation;
      }
    });

    return computerNotation;
  }

  function computeCenter(vertices) {
    var center = new THREE.Vector3(0, 0, 0);

    vertices.forEach(function(vertex) {
      center.add(vertex);
    });

    center.divideScalar(vertices.length);

    return center;
  }

  function connectPrisms(leftPrism, rightPrism) {
    // because material groups are used for each prism
    // the first child material is simply taken as the
    // geometry is simply replicated for each material
    var rightCenterInWorld = new THREE.Vector3(0, 0, 0);
    rightCenterInWorld.copy(leftPrism.children[0].geometry.right);
    rightCenterInWorld.applyMatrix4(leftPrism.matrix);

    var leftCenterInWorld = new THREE.Vector3(0, 0, 0);
    leftCenterInWorld.copy(rightPrism.children[0].geometry.left);
    leftCenterInWorld.applyMatrix4(rightPrism.matrix);

    var displacement = new THREE.Vector3(0, 0, 0);
    displacement.subVectors(rightCenterInWorld, leftCenterInWorld);

    // move rightPrism by displacement to correct position
    rightPrism.position.add(displacement);
    rightPrism.updateMatrix();
  }

  function advanceQuaternion(mesh, angle) {
    // transforming a normal requires the inverse transpose
    // of the transformation matrix
    var inverseTransposeM = new THREE.Matrix4();
    inverseTransposeM.getInverse(mesh.matrix);
    inverseTransposeM.transpose();

    var rightCenterNormal = new THREE.Vector3(0, 0, 0);
    rightCenterNormal.copy(mesh.children[0].geometry.rightNormal);

    // transform normal to world space
    rightCenterNormal.applyMatrix4(inverseTransposeM);
    rightCenterNormal.normalize();

    // round the normal to always "snap" to the primary
    // axis to avoid numerical instabilities for the rotation
    rightCenterNormal.x = Math.round(rightCenterNormal.x);
    rightCenterNormal.y = Math.round(rightCenterNormal.y);
    rightCenterNormal.z = Math.round(rightCenterNormal.z);

    var q = new THREE.Quaternion();
    q.setFromAxisAngle(rightCenterNormal, angle * Math.PI / 2);
    return q;
  }

  function setupCamera() {
    // WARNING: Both init() and build() have had to be executed
    // before, as this function relies on globally set variables

    // to ensure that the figure is always visible using an
    // orthographic camera the axis aligned bounding box
    // is calculated and the longest side is used to define
    // the view frustum of the camera
    var minX = 99999;
    var minY = 99999;
    var minZ = 99999;
    var maxX = -99999;
    var maxY = -99999;
    var maxZ = -99999;
    prisms.forEach(function(prism) {
      if (prism.position.x < minX) {
        minX = prism.position.x;
      } else if (prism.position.x > maxX) {
        maxX = prism.position.x;
      }
      if (prism.position.y < minY) {
        minY = prism.position.y;
      } else if (prism.position.y > maxY) {
        maxY = prism.position.y;
      }
      if (prism.position.z < minZ) {
        minZ = prism.position.z;
      } else if (prism.position.z > maxZ) {
        maxZ = prism.position.z;
      }
    });

    var rangeX = maxX - minX;
    var rangeY = maxY - minY;
    var rangeZ = maxZ - minZ;

    var range = Math.max.apply(Math, [rangeX, rangeY, rangeZ]);
    var frustum = range;

    camera = new THREE.OrthographicCamera(-frustum, frustum, frustum, -frustum, -frustum, frustum);
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
  }

  exports.init = function(width, height) {
    geometryEven = new THREE.Geometry();
    geometryEven.vertices.push(new THREE.Vector3(0, -1, 0));
    geometryEven.vertices.push(new THREE.Vector3(0, 0, 0));
    geometryEven.vertices.push(new THREE.Vector3(1, 0, 0));
    geometryEven.vertices.push(new THREE.Vector3(0, -1, -1));
    geometryEven.vertices.push(new THREE.Vector3(0, 0, -1));
    geometryEven.vertices.push(new THREE.Vector3(1, 0, -1));

    geometryEven.faces.push(new THREE.Face3(0, 2, 1));
    geometryEven.faces.push(new THREE.Face3(3, 4, 5));
    geometryEven.faces.push(new THREE.Face4(0, 1, 4, 3));
    geometryEven.faces.push(new THREE.Face4(1, 2, 5, 4));
    geometryEven.faces.push(new THREE.Face4(0, 3, 5, 2));

    var c, r, l;
    c = computeCenter(geometryEven.vertices);
    geometryEven.vertices.forEach(function(vertex) {
      vertex = vertex.sub(c);
    });

    r = computeCenter([geometryEven.vertices[1], geometryEven.vertices[2], geometryEven.vertices[4], geometryEven.vertices[5]]);
    geometryEven.right = r;
    geometryEven.rightNormal = new THREE.Vector3(0, 1, 0);

    l = computeCenter([geometryEven.vertices[0], geometryEven.vertices[1], geometryEven.vertices[3], geometryEven.vertices[4]]);
    geometryEven.left = l;
    geometryEven.leftNormal = new THREE.Vector3(-1, 0, 0);

    geometryOdd = new THREE.Geometry();
    geometryOdd.vertices.push(new THREE.Vector3(0, 0, 0));
    geometryOdd.vertices.push(new THREE.Vector3(1, 0, 0));
    geometryOdd.vertices.push(new THREE.Vector3(1, 1, 0));
    geometryOdd.vertices.push(new THREE.Vector3(0, 0, -1));
    geometryOdd.vertices.push(new THREE.Vector3(1, 0, -1));
    geometryOdd.vertices.push(new THREE.Vector3(1, 1, -1));

    geometryOdd.faces.push(new THREE.Face3(0, 1, 2));
    geometryOdd.faces.push(new THREE.Face3(5, 4, 3));
    geometryOdd.faces.push(new THREE.Face4(0, 3, 4, 1));
    geometryOdd.faces.push(new THREE.Face4(1, 4, 5, 2));
    geometryOdd.faces.push(new THREE.Face4(0, 2, 5, 3));

    c = computeCenter(geometryOdd.vertices);
    geometryOdd.vertices.forEach(function(vertex) {
      vertex = vertex.sub(c);
    });

    r = computeCenter([geometryOdd.vertices[1], geometryOdd.vertices[2], geometryOdd.vertices[4], geometryOdd.vertices[5]]);
    geometryOdd.right = r;
    geometryOdd.rightNormal = new THREE.Vector3(1, 0, 0);

    l = computeCenter([geometryOdd.vertices[0], geometryOdd.vertices[1], geometryOdd.vertices[3], geometryOdd.vertices[4]]);
    geometryOdd.left = l;
    geometryOdd.leftNormal = new THREE.Vector3(0, -1, 0);

    materialOdd = [
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      shading: THREE.FlatShading,
      wireframe: true,
      transparent: false
    }),
    new THREE.MeshBasicMaterial({
      color: 0x43b3a3
    })];
    materialEven = [
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      shading: THREE.FlatShading,
      wireframe: true,
      transparent: false
    }),
    new THREE.MeshBasicMaterial({
      color: 0x5770b7
    })];

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);

    return renderer;
  };

  exports.build = function(humanNotation, rotation) {
    rotation = typeof rotation !== 'undefined' ? rotation : "[0,0,0]";

    var rotationArray = JSON.parse(rotation);

    scene = new THREE.Scene();
    figure = new THREE.Object3D();
    figure.useQuaternion = true;
    figure.quaternion = new THREE.Quaternion();
    figure.quaternion.setFromEuler(new THREE.Vector3(rotationArray[0] * Math.PI / 180, rotationArray[1] * Math.PI / 180, rotationArray[2] * Math.PI / 180));
    scene.add(figure);
    prisms = [];
    var computerNotation = parseNotation(humanNotation);

    // after adding a new prism its exit direction
    // is cumulated in this quaternion to be used to
    // orient the next prism
    var Q = new THREE.Quaternion();
    var previous = null;

    for (var i = 0; i < computerNotation.length; i++) {
      var mesh;
      if (i % 2) {
        mesh = THREE.SceneUtils.createMultiMaterialObject(geometryOdd, materialOdd);
      } else {
        mesh = THREE.SceneUtils.createMultiMaterialObject(geometryEven, materialEven);
      }
      mesh.useQuaternion = true;
      figure.add(mesh);
      prisms.push(mesh);

      mesh.quaternion.copy(Q);
      mesh.updateMatrix();

      Q.multiplyQuaternions(advanceQuaternion(mesh, computerNotation[i]), Q);

      if (previous !== null) {
        connectPrisms(previous, mesh);
      }
      previous = mesh;
    }

    // center each figure around 0,0,0
    var positions = prisms.map(function(prism) {
      return prism.position;
    });
    var center = computeCenter(positions);
    prisms.forEach(function(prism) {
      prism.position.sub(center);
    });

    setupCamera();
  };

  exports.arcball = function(dx, dy) {

    var up = new THREE.Vector3(0, 1, 0);
    var right = new THREE.Vector3(1, 0, 0);

    var q = new THREE.Quaternion();
    q.copy(figure.quaternion);
    var invQ = new THREE.Quaternion();
    invQ.copy(q);
    invQ.inverse();

    up.applyMatrix4(invQ);
    var upQ = new THREE.Quaternion();
    upQ.setFromAxisAngle(up, 0.0005 * dx * 180 / Math.PI);
    q.multiply(q, upQ);

    right.applyMatrix4(invQ);
    var rightQ = new THREE.Quaternion();
    rightQ.setFromAxisAngle(right, 0.0005 * dy * 180 / Math.PI);
    q.multiply(q, rightQ);

    figure.quaternion = q;
    figure.updateMatrix();

    renderer.render(scene, camera);
  };

  exports.rotateCamera = function(rotationX, rotationY, rotationZ) {
    camera.rotation.x += rotationX;
    camera.rotation.y += rotationY;
    camera.rotation.z += rotationZ;

    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
})(typeof exports === 'undefined' ? this.snake = {} : exports);