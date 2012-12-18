$(document).ready(function() {
	
	$('.fancybox').fancybox({
        beforeLoad : function() {
			var human = $(this.element).attr('data');
			var notation = parseNotation(human);
			build(notation);
        }
    });
	
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
	
	$('#3dviewer').hide();
	
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
		
		var q = new THREE.Quaternion();
		q.setFromAxisAngle(n1, angle * Math.PI/2);
		return q;
	}
	
	function build(notation) {
	    scene = new THREE.Scene();
		pieces = [];
		
		var Q = new THREE.Quaternion();
		
		var previous = null;
		for(var i = 0; i < notation.length; i++) {
			if(i % 2) {
				// console.log('odd');
				var mesh = THREE.SceneUtils.createMultiMaterialObject(geometryOdd, materialOdd);
			} else {
				var mesh = THREE.SceneUtils.createMultiMaterialObject(geometryEven, materialEven);
			}
			mesh.useQuaternion = true;
			scene.add(mesh);
			pieces.push(mesh);
			
			mesh.quaternion.copy(Q);
			mesh.updateMatrix();
			
			Q.multiply(computeQuaternion(mesh, notation[i]),Q);
			
			if(previous !== null) {
				connect(previous, mesh);
			}
			previous = mesh;
		}
		
		var positions = pieces.map(function(mesh) {
			return mesh.position;
		})
		var center = calculateCenter(positions);
		
		pieces.forEach(function(mesh) {
			mesh.position.subSelf(center);
		});
		
		setupCamera();
	}
	
	function calculateCenter(vertices) {
		var center = new THREE.Vector3(0,0,0);
		
		vertices.forEach(function(vertex) {
			center.addSelf(vertex);
		});
		
		center.divideScalar(vertices.length);
		
		return center;
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
		geometryEven.faces.push(new THREE.Face3(3,4,5));
		geometryEven.faces.push(new THREE.Face4(0,1,4,3));
		geometryEven.faces.push(new THREE.Face4(1,2,5,4));
		geometryEven.faces.push(new THREE.Face4(0,3,5,2));
		
		var c = calculateCenter(geometryEven.vertices);
		geometryEven.vertices.forEach(function(vertex) {
			vertex = vertex.subSelf(c);
		});
		
		var r = calculateCenter([geometryEven.vertices[1],geometryEven.vertices[2],geometryEven.vertices[4],geometryEven.vertices[5]]);
		geometryEven.right = r;
		geometryEven.rightNormal = new THREE.Vector3(0,1,0);
		
		var l = calculateCenter([geometryEven.vertices[0],geometryEven.vertices[1],geometryEven.vertices[3],geometryEven.vertices[4]]);
		geometryEven.left = l;
		geometryEven.leftNormal = new THREE.Vector3(-1,0,0);
		
		geometryOdd = new THREE.Geometry();
		geometryOdd.vertices.push(new THREE.Vector3(0,0,0));
		geometryOdd.vertices.push(new THREE.Vector3(1,0,0));
		geometryOdd.vertices.push(new THREE.Vector3(1,1,0));
		geometryOdd.vertices.push(new THREE.Vector3(0,0,-1));
		geometryOdd.vertices.push(new THREE.Vector3(1,0,-1));
		geometryOdd.vertices.push(new THREE.Vector3(1,1,-1));
		
		geometryOdd.faces.push(new THREE.Face3(0,1,2));
		geometryOdd.faces.push(new THREE.Face3(5,4,3));
		geometryOdd.faces.push(new THREE.Face4(0,3,4,1));
		geometryOdd.faces.push(new THREE.Face4(1,4,5,2));
		geometryOdd.faces.push(new THREE.Face4(0,2,5,3));
		
		var c = calculateCenter(geometryOdd.vertices);
		geometryOdd.vertices.forEach(function(vertex) {
			vertex = vertex.subSelf(c);
		});
		
		var r = calculateCenter([geometryOdd.vertices[1],geometryOdd.vertices[2],geometryOdd.vertices[4],geometryOdd.vertices[5]]);
		geometryOdd.right = r;
		geometryOdd.rightNormal = new THREE.Vector3(1,0,0);
		
		var l = calculateCenter([geometryOdd.vertices[0],geometryOdd.vertices[1],geometryOdd.vertices[3],geometryOdd.vertices[4]]);;
		geometryOdd.left = l;
		geometryOdd.leftNormal = new THREE.Vector3(0,-1,0);
		
		materialOdd = [
		    new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: false}),
		    new THREE.MeshBasicMaterial({color: 0x43b3a3}) 
		];
		materialEven = [
		    new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: false}),
		    new THREE.MeshBasicMaterial({color: 0x5770b7}) 
		];

	    renderer = new THREE.CanvasRenderer();
	    renderer.setSize( 500, 500 );

	    $('#3dviewer').append( renderer.domElement );
		
		$('canvas').mousedown(function(ev){
			
			switch(ev.which) {
				case 1:
					var lastX = ev.pageX;
					var lastY = ev.pageY;
			
					$('canvas').bind('mousemove', function(ev) {
						var diffX = ev.pageX - lastX;
						var diffY = ev.pageY - lastY;
				
						camera.rotation.y -= diffX * Math.PI/180;
						camera.rotation.x -= diffY * Math.PI/180;
						camera.updateProjectionMatrix();
				
						lastX = ev.pageX;
						lastY = ev.pageY;
				
					    renderer.render( scene, camera );
					});
					break;
				case 3:
					ev.preventDefault();
					var canvas = $('canvas').get(0);
					var dataUrl = canvas.toDataURL('image/png');
					window.open(dataUrl, "toDataURL() image", "width=500, height=500");
					ev.preventDefault();
					break;
				default:
			}
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
		frustum = range;
		
		camera = new THREE.OrthographicCamera(-frustum, frustum, frustum, -frustum, -frustum, frustum);
		camera.updateProjectionMatrix();	
		
	    renderer.render( scene, camera );	
	}

	function animate() {
	
	    // note: three.js includes requestAnimationFrame shim
	    requestAnimationFrame( animate );
	
	    // mesh.rotation.x += 0.01;
	    // mesh.rotation.y += 0.02;
	
	    renderer.render( scene, camera );
	}
});