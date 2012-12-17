$(document).ready(function() {
	// var human = '10R2-10L2-8L2-7R2-5R2-5L2-2R2';
	var map = {
		'1R' : 0,
		'2L' : 1,
		'2R' : 2,
		'3L' : 3,
		'3R' : 4,
		'4L' : 5,
		'4R' : 6,
		'5L' : 7,
		'5R' : 8,
		'6L' : 9,
		'6R' : 10,
		'7L' : 11,
		'7R' : 12,
		'8L' : 13,
		'8R' : 14,
		'9L' : 15,
		'9R' : 16,
		'10L' : 17,
		'10R' : 18,
		'11L' : 19,
		'11R' : 20,
		'12L' : 21,
		'12R' : 22,
	};
	
	var camera, scene, renderer;
	var geometryEven, geometryOdd, materialEven, materialOdd;
	var pieces = [];

	init();
	//1R2-2L3-3R3-4R3-4L2-5L2-5R1-6L2-6R3-9L3-11R2-12L2-10L1-9R2
	
	var notation = parseNotation('1R2-2L1-3R3-4R3-4L2-5L2-5R1-6L2-6R3-9L1-11R2-12L2-10L3-9R2');
	build(notation);
	setupCamera();
	animate();
	
	function parseNotation(human) {
		var planes = human.split(/-/g);

		var computer = [];
		for(var i = 0; i < 24; i++) {
		    computer.push(0);
		}
		planes.forEach(function(plane) {
			var split_index = plane.search(/R|L/);
	
			var position = plane.substring(0,split_index+1);
			var side = plane.substring(split_index,split_index+1);
			var orientation = parseInt(plane.substring(split_index+1, plane.length));
			if(side === 'L') {
				if (orientation === 3) {
					orientation = 3;
				} else if (orientation === 1) {
					orientation = 1;
				}
			}
	
			computer[map[position]] = orientation;
		});
		
		return computer;
	}
	
	function connect(left, right) {
		var a1 = new THREE.Vector3(0,0,0);
		a1.copy(left.children[0].geometry.right);
		left.matrix.multiplyVector3(a1);
		
		var a2 = new THREE.Vector3(0,0,0);
		a2.copy(right.children[0].geometry.left);
		right.matrix.multiplyVector3(a2);
		
		var diff = new THREE.Vector3(0,0,0);
		diff.sub(a1,a2);
		
		right.position.addSelf(diff);
		right.updateMatrix();
	}
	
	function computeQuaternion(mesh, angle) {
		var inverseTransposeM = new THREE.Matrix4();
		inverseTransposeM.getInverse(mesh.matrix);
		inverseTransposeM.transpose();
		
		var n1 = new THREE.Vector3(0,0,0);
		n1.copy(mesh.children[0].geometry.rightNormal);
		inverseTransposeM.multiplyVector3(n1);
		n1.normalize();
		n1.x = Math.round(n1.x);
		n1.y = Math.round(n1.y);
		n1.z = Math.round(n1.z);
		
		// console.log('x: ' + n1.x);
		// console.log('y: ' + n1.y);
		// console.log('z: ' + n1.z);
		// console.log('*****');
		
		var q = new THREE.Quaternion();
		q.setFromAxisAngle(n1, angle * Math.PI/2);
		return q;
	}
	
	function build(notation) {
	    scene = new THREE.Scene();
		pieces = [];
		
		var R = new THREE.Vector3(0,0,0);
		var Q = new THREE.Quaternion();
		
		var previous = null;
		for(var i = 0; i < notation.length; i++) {
			if(i % 2) {
				// console.log('odd');
				var mesh = THREE.SceneUtils.createMultiMaterialObject(geometryOdd, materialOdd);
			} else {
				var mesh = THREE.SceneUtils.createMultiMaterialObject(geometryEven, materialEven);
			}
			mesh.overdraw = true;
			mesh.useQuaternion = true;
			scene.add(mesh);
			pieces.push(mesh);
			
			// mesh.rotation.copy(R);
			mesh.quaternion.copy(Q);
			mesh.updateMatrix();
			
			Q.multiply(computeQuaternion(mesh, notation[i]),Q);
			
			// var axis = computeRotationAxis(mesh);
			// R[axis[0]] += axis[1] * notation[i] * Math.PI/2;
			
			// if (R[axis[0]] > 2*Math.PI) {
			// 	R[axis[0]] -= 2*Math.PI;
			// } else if (R[axis[0]] < -2*Math.PI) {
			// 	R[axis[0]] += 2*Math.PI;
			// }
			// console.log('Rx: ' + R.x);
			// console.log('Ry: ' + R.y);
			// console.log('Rz: ' + R.z);
			// console.log('-----');
			
			if(previous !== null) {
				connect(previous, mesh);
			}
			previous = mesh;
		}
		
		// var sphere = new THREE.SphereGeometry(1,8,8);
		// 
		// var mesh = new THREE.Mesh(geometryOdd,materialOdd);
		// // mesh.useQuaternion = true;
		// scene.add(mesh);
		// pieces.push(mesh);
		// 	
		// var q = new THREE.Quaternion();
		// q.setFromAxisAngle(new THREE.Vector3(1,0,0), 1 * Math.PI/2);
		// mesh.quaternion.copy(q);
		// 
		// var q2 = new THREE.Quaternion();
		// q2.setFromAxisAngle(new THREE.Vector3(0,0,1), 1 * Math.PI/2);
		// mesh.quaternion.multiply(q2,mesh.quaternion);
	}
	
	function init() {
		geometryEven = new THREE.Geometry();
		geometryEven.vertices.push(new THREE.Vector3(0,-1,0));
		geometryEven.vertices.push(new THREE.Vector3(0,0,0));
		geometryEven.vertices.push(new THREE.Vector3(1,0,0));
		geometryEven.vertices.push(new THREE.Vector3(0,-1,-1));
		geometryEven.vertices.push(new THREE.Vector3(0,0,-1));
		geometryEven.vertices.push(new THREE.Vector3(1,0,-1));
		
		geometryEven.faces.push(new THREE.Face3(0,2,1));
		geometryEven.faces.push(new THREE.Face3(2,1,0));
		geometryEven.faces.push(new THREE.Face3(3,4,5));
		geometryEven.faces.push(new THREE.Face3(5,4,3));
		geometryEven.faces.push(new THREE.Face4(0,1,4,3));
		geometryEven.faces.push(new THREE.Face4(3,4,1,0));
		geometryEven.faces.push(new THREE.Face4(1,2,5,4));
		geometryEven.faces.push(new THREE.Face4(4,5,2,1));
		geometryEven.faces.push(new THREE.Face4(0,3,5,2));
		geometryEven.faces.push(new THREE.Face4(2,5,3,0));
		
		var center = new THREE.Vector3(0,0,0);
		geometryEven.vertices.forEach(function(vertex) {
			center = center.addSelf(vertex);
		});
		center = center.divideScalar(geometryEven.vertices.length);
		geometryEven.center = center;
		
		geometryEven.vertices.forEach(function(vertex) {
			vertex = vertex.subSelf(center);
		});
		
		var r = new THREE.Vector3(0,0,0);
		r.addSelf(geometryEven.vertices[1]);
		r.addSelf(geometryEven.vertices[2]);
		r.addSelf(geometryEven.vertices[4]);
		r.addSelf(geometryEven.vertices[5]);
		r = r.divideScalar(4);
		geometryEven.right = r;
		geometryEven.rightNormal = new THREE.Vector3(0,1,0);
		
		var l = new THREE.Vector3(0,0,0);
		l.addSelf(geometryEven.vertices[0]);
		l.addSelf(geometryEven.vertices[1]);
		l.addSelf(geometryEven.vertices[3]);
		l.addSelf(geometryEven.vertices[4]);
		l = l.divideScalar(4);
		geometryEven.left = l;
		geometryEven.leftNormal = new THREE.Vector3(-1,0,0);
		geometryEven.computeFaceNormals();
		geometryEven.computeVertexNormals();
		
		geometryOdd = new THREE.Geometry();
		geometryOdd.vertices.push(new THREE.Vector3(0,0,0));
		geometryOdd.vertices.push(new THREE.Vector3(1,0,0));
		geometryOdd.vertices.push(new THREE.Vector3(1,1,0));
		geometryOdd.vertices.push(new THREE.Vector3(0,0,-1));
		geometryOdd.vertices.push(new THREE.Vector3(1,0,-1));
		geometryOdd.vertices.push(new THREE.Vector3(1,1,-1));
		
		geometryOdd.faces.push(new THREE.Face3(0,1,2));
		geometryOdd.faces.push(new THREE.Face3(2,1,0));
		geometryOdd.faces.push(new THREE.Face3(5,4,3));
		geometryOdd.faces.push(new THREE.Face3(3,4,5));
		geometryOdd.faces.push(new THREE.Face4(0,3,4,1));
		geometryOdd.faces.push(new THREE.Face4(1,4,3,0));
		geometryOdd.faces.push(new THREE.Face4(1,4,5,2));
		geometryOdd.faces.push(new THREE.Face4(2,5,4,1));
		geometryOdd.faces.push(new THREE.Face4(0,2,5,3));
		geometryOdd.faces.push(new THREE.Face4(3,5,2,0));
		
		var center = new THREE.Vector3(0,0,0);
		geometryOdd.vertices.forEach(function(vertex) {
			center = center.addSelf(vertex);
		});
		center = center.divideScalar(geometryOdd.vertices.length);
		geometryOdd.center = center;
		
		geometryOdd.vertices.forEach(function(vertex) {
			vertex = vertex.subSelf(center);
		});
		
		var r = new THREE.Vector3(0,0,0);
		r.addSelf(geometryOdd.vertices[1]);
		r.addSelf(geometryOdd.vertices[2]);
		r.addSelf(geometryOdd.vertices[4]);
		r.addSelf(geometryOdd.vertices[5]);
		r = r.divideScalar(4);
		geometryOdd.right = r;
		geometryOdd.rightNormal = new THREE.Vector3(1,0,0);
		
		var l = new THREE.Vector3(0,0,0);
		l.addSelf(geometryOdd.vertices[0]);
		l.addSelf(geometryOdd.vertices[1]);
		l.addSelf(geometryOdd.vertices[3]);
		l.addSelf(geometryOdd.vertices[4]);
		l = l.divideScalar(4);
		geometryOdd.left = l;
		geometryOdd.leftNormal = new THREE.Vector3(0,-1,0);
		geometryOdd.computeFaceNormals();
		geometryOdd.computeVertexNormals();
		
		materialOdd = [
		    new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: false}),
		    new THREE.MeshBasicMaterial({color: 0x43b3a3}) 
		];
		materialEven = [
		    new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: false}),
		    new THREE.MeshBasicMaterial({color: 0x5770b7}) 
		];
	    // materialOdd = new THREE.MeshLambertMaterial( { color: 0x43b3a3, wireframe: false } );
	    // materialEven = new THREE.MeshLambertMaterial( { color: 0x5770b7, wireframe: false } );

	    renderer = new THREE.CanvasRenderer();
	    renderer.setSize( 500, 500 );

	    $('#3dviewer').append( renderer.domElement );
		
		$('canvas').mousedown(function(ev){
			
			var lastX = ev.pageX;
			var lastY = ev.pageY;
			
			$('canvas').bind('mousemove', function(ev) {
				var diffX = ev.pageX - lastX;
				var diffY = ev.pageY - lastY;
				
				camera.rotation.y -= diffX * Math.PI/180;
				camera.rotation.x += diffY * Math.PI/180;
				camera.updateProjectionMatrix();
				
				lastX = ev.pageX;
				lastY = ev.pageY;
			});
		});
		$(document).mouseup(function(){
			$('canvas').unbind('mousemove');
		}); 
	}
	
	function setupCamera() {
		
		var center = new THREE.Vector3(0,0,0);
		
		var minX = 99999;
		var minY = 99999;
		var minZ = 99999;
		var maxX = -99999;
		var maxY = -99999;
		var maxZ = -99999;
		pieces.forEach(function(piece) {
			center.addSelf(piece.position);
			
			if(piece.position.x < minX) {
				minX = piece.position.x;
			} else if (piece.position.x > maxX) {
				maxX = piece.position.x;
			}
			if(piece.position.y < minY) {
				minY = piece.position.y;
			} else if (piece.position.y > maxY) {
				maxY = piece.position.y;
			}
			if(piece.position.z < minZ) {
				minZ = piece.position.z;
			} else if (piece.position.z > maxZ) {
				maxZ = piece.position.z;
			}
		});
		center = center.divideScalar(pieces.length);
		
		var rangeX = maxX - minX;
		var rangeY = maxY - minY;
		var rangeZ = maxZ - minZ;
		
		var range = Math.max.apply(Math, [rangeX, rangeY, rangeZ]);
		
		// var range;
		// if (rangeX > rangeY) {
		// 	if (rangeX > rangeZ) {
		// 		range = rangeX;
		// 	}
		// } else {
		// 	if (rangeY > rangeZ) {
		// 		range = rangeY;
		// 	} else {
		// 		range = rangeZ;
		// 	}
		// }
		// var frustum = range;
		frustum = range;
		
		camera = new THREE.OrthographicCamera(-frustum, frustum, frustum, -frustum, -frustum, frustum);
	    camera.position = center;
		camera.updateProjectionMatrix();		
	}

	function animate() {
	
	    // note: three.js includes requestAnimationFrame shim
	    requestAnimationFrame( animate );
	
	    // mesh.rotation.x += 0.01;
	    // mesh.rotation.y += 0.02;
	
	    renderer.render( scene, camera );
	}
	
	$('.figure').click(function(ev) {
		ev.preventDefault();
		
		var newHuman = $(this).find('.notation').text();
		build(parseNotation(newHuman));
		setupCamera();
		
		return false;
	})

});