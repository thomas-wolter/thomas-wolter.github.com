import * as THREE from 'three';
import { Vector3 } from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

class PrismGeometry extends THREE.BufferGeometry {
    constructor() {
        super();

        this.type = 'PrismGeometry'

        // buffers
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        // helper variables
        let groupStart = 0;

        // build each side of the prism geometry
        // front
        vertices.push(0, 0, 0); //0
        vertices.push(1, 0, 0); //1
        vertices.push(1, 1, 0); //2
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);
        uvs.push(1, 1);
        indices.push(0, 1, 2);
        this.addGroup(groupStart, 3, 0);
        groupStart += 3;
        // back
        vertices.push(0, 0, -1); //3
        vertices.push(1, 0, -1); //4
        vertices.push(1, 1, -1); //5
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        uvs.push(1, 0);
        uvs.push(0, 0);
        uvs.push(0, 1);
        indices.push(5, 4, 3);
        this.addGroup(groupStart, 3, 1);
        groupStart += 3;
        // right
        vertices.push(1, 0, 0); //6
        vertices.push(1, 0, -1); //7
        vertices.push(1, 1, -1); //8
        vertices.push(1, 1, 0); //9
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);
        uvs.push(0, 0);
        uvs.push(1, 0);
        uvs.push(1, 1);
        uvs.push(0, 1);
        indices.push(6, 7, 8);
        indices.push(6, 8, 9);
        this.addGroup(groupStart, 6, 2);
        groupStart += 6;
        // bottom
        vertices.push(0, 0, 0); //10
        vertices.push(1, 0, 0); //11
        vertices.push(1, 0, -1); //12
        vertices.push(0, 0, -1); //13
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        uvs.push(0, 1);
        uvs.push(1, 1);
        uvs.push(1, 0);
        uvs.push(0, 0);
        indices.push(13, 12, 11);
        indices.push(13, 11, 10);
        this.addGroup(groupStart, 6, 3);
        groupStart += 6;
        // diagonal
        vertices.push(0, 0, 0); //14
        vertices.push(1, 1, 0); //15
        vertices.push(1, 1, -1); //16
        vertices.push(0, 0, -1); //17
        normals.push(-1, 1, 0);
        normals.push(-1, 1, 0);
        normals.push(-1, 1, 0);
        normals.push(-1, 1, 0);
        uvs.push(1, 0);
        uvs.push(1, Math.SQRT2);
        uvs.push(0, Math.SQRT2);
        uvs.push(0, 0);
        indices.push(15, 16, 17);
        indices.push(14, 15, 17);
        this.addGroup(groupStart, 6, 4);

        // build geometry
        this.setIndex(indices);
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        this.translate(0, 0, 0.5);
        this.rotateZ(3 * Math.PI / 4);
        this.translate(Math.SQRT2, 0, 0);
        this.translate(-Math.SQRT2 / 4, -Math.SQRT2 / 4, 0);
    }
}

class Wedge extends THREE.Mesh {
    constructor(material) {
        const geometry = new PrismGeometry(); // Hard coded geometry

        super(geometry, material);

        this.castShadow = true;
        this.receiveShadow = true;

        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        this.add(line);
    }
}

class Figure extends THREE.Group {
    constructor(materials, numWedges = 24) {
        super();

        this.wedges = []

        // Create and add the first wedge to the group outside of the loop
        const firstWedge = new Wedge(materials[0]);
        this.add(firstWedge);
        this.wedges.push(firstWedge);
        let previousWedge = firstWedge;

        // Create and add the remaining wedges inside the loop
        for (let i = 1; i < numWedges; i++) {
            const wedge = new Wedge(materials[i % materials.length]);

            wedge.position.x += Math.SQRT2 / 2;
            wedge.rotateX(Math.PI);
            previousWedge.add(wedge);
            this.wedges.push(wedge);
            previousWedge = wedge;
        }

        this.castShadow = true;
        this.receiveShadow = true;
    }

    twist(computerNotation) {
        computerNotation.forEach(element => {
            this.twistWedge(element.index, element.turn)
        });
    }

    twistWedge(index, turn) {
        switch (turn) {
            case 1:
                this.wedges[index].rotateOnAxis(new THREE.Vector3(1, -1, 0).normalize(), -Math.PI / 2);
                break;
            case 2:
                this.wedges[index].rotateOnAxis(new THREE.Vector3(1, -1, 0).normalize(), Math.PI);
                break;
            case 3:
                this.wedges[index].rotateOnAxis(new THREE.Vector3(1, -1, 0).normalize(), Math.PI / 2);
                break;
            default:
                break;
        }
    }
}

/**
 * Centers the specified THREE.Object3D in the scene by adjusting its position.
 * 
 * @param {THREE.Object3D} object - The object to center in the scene.
 */
function centerObject(object) {
    // Calculate the bounding box
    const bbox = new THREE.Box3().setFromObject(object);

    // Calculate the center point of the bounding box
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    // Calculate the offset needed to move the group to the center
    const offset = center.negate();

    // Move the group by the offset
    object.position.add(offset);

    const bbox2 = new THREE.Box3().setFromObject(object);
}

const Turns = Object.freeze({
    CLOCKWISE: 1,
    HALF_TURN: 2,
    COUNTERCLOCKWISE: 3,
});

const Sides = Object.freeze({
    LEFT: 0,
    RIGHT: 1,
})

/**
 * Parses a human-readable Rubik's Snake notation and returns a computer-readable representation of the moves.
 * @param {string} humanNotation - The human-readable notation to parse.
 * @returns {Array} An array of objects representing the moves.
 */
function parseHumanNotation(humanNotation) {
    // Split the notation into individual moves using a regular expression
    const moves = humanNotation.split(/[,-\.]/);

    // Define an object to map move turns to numerical values
    const turnsRMap = {
        '1': Turns.CLOCKWISE,
        '2': Turns.HALF_TURN,
        '3': Turns.COUNTERCLOCKWISE,
    };
    const turnsLMap = {
        '3': Turns.CLOCKWISE,
        '2': Turns.HALF_TURN,
        '1': Turns.COUNTERCLOCKWISE,
    }

    // Define an object to map move sides to numerical values
    const sidesMap = {
        'L': Sides.LEFT,
        'R': Sides.RIGHT,
    };

    // Define an array to hold the computer-readable moves
    const parsedMoves = moves.map((move) => {
        const [humanIndex, side, humanTurn] = move.split(/([LR])/);

        // Convert the human-readable values to computer-readable values
        var index = -1;
        var turn = -1;
        if (sidesMap[side] == Sides.LEFT) {
            index = (parseInt(humanIndex) - 1) * 2;
            turn = turnsLMap[humanTurn];
        } else if (sidesMap[side] == Sides.RIGHT) {
            index = (parseInt(humanIndex) * 2) - 1;
            turn = turnsRMap[humanTurn];
        } else {
            // Invalid side
            return {}
        }
        return {
            index: index,
            turn: turn
        }
    });

    return parsedMoves;
}

var renderer = null;
var scene = null;
var figure = null;
var camera = null;

const materials = [
    // new THREE.MeshBasicMaterial({ color: 0x93CEBD }),
    // new THREE.MeshBasicMaterial({ color: 0x9F93CE }),
    new THREE.MeshLambertMaterial({ color: 0x6667AB }),
    new THREE.MeshLambertMaterial({ color: 0x00C893 }),
];

window.snakeCreate = () => {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById("canvas")
    });
    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;
    // renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.castShadow = true;
    dirLight.position.set(1, 1, 1);

    scene.add(ambLight);
    scene.add(dirLight);

    const aspect = width / height;
    const frustumSize = 10;
    camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0, 1000);
    scene.add(camera);

    const controls = new ArcballControls(camera, renderer.domElement, scene);
    controls.enablePan = false;
    controls.addEventListener('change', function() {
        renderer.render(scene, camera);
    });
    controls.setGizmosVisible(false);

    return scene;
}

window.snakeUpdate = (humanNotation, euler = [0, 0, 0]) => {
    scene.remove(figure);
    figure = new Figure(materials);
    figure.twist(parseHumanNotation(humanNotation));

    const bbox = new THREE.Box3().setFromObject(figure);
    const bsphere = new THREE.Sphere();
    bbox.getBoundingSphere(bsphere);
    const viewRadius = bsphere.radius * 2 * 1.02;

    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;
    const aspect = width / height;

    const frustumSize = viewRadius;
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2
    camera.bottom = frustumSize / -2
    camera.position.set(0, 0, viewRadius);
    camera.updateProjectionMatrix();

    scene.add(figure);
    figure.setRotationFromEuler(new THREE.Euler(euler[0] * (Math.PI / 180), euler[1] * (Math.PI / 180), euler[2] * (Math.PI / 180) + Math.PI / 4));

    centerObject(figure);
    renderer.render(scene, camera);
}

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);

        const bbox = new THREE.Box3().setFromObject(figure);
        const bsphere = new THREE.Sphere();
        bbox.getBoundingSphere(bsphere);
        const viewRadius = bsphere.radius * 2 * 1.02;

        const aspect = width / height;
        const frustumSize = viewRadius;
        camera.left = frustumSize * aspect / -2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2
        camera.bottom = frustumSize / -2
        camera.updateProjectionMatrix();
        // update any render target sizes here
    }
}

window.snakeAnimate = () => {
        resizeCanvasToDisplaySize();

        renderer.render(scene, camera);
        requestAnimationFrame(window.snakeAnimate);
    }
    // window.snakeCreate();
    // window.snakeUpdate('');
    //requestAnimationFrame(animate);