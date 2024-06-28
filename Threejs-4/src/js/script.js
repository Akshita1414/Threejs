
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);
orbit.update();

//box geometry
const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

//sphere geometry
const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({ 
	color: 0xff0000, 
	wireframe: true,
 });
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
scene.add(sphereMesh);

//ground geometry
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: true 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

//Step1: Create a physics world
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});


//Body for ground geometry
const groundPhysMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),//iiski jgh dusri shape issliye use ki hmne kyuki jo plane hota h vo infinite hota h or hme plane ko limited bnana tha taaki jb box uski boundary k bhaar jye toh vo neeche gir jye naaki uske bhar jke sidha khda hojye
    //mass: 10 //agr mass 0 se greater hoga toh body neeche giregi
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)), // And the coordinates shoukd be half of the values set in three js
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); //Taaki vo 1 ground ki trh rotate hojye jiske uppar hm objects rkh ske

//body for box material
const boxPhysMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), //This vec3 reprsents the dimension of the body and the values should be half of he values we have set in three js body
    position: new CANNON.Vec3(1, 20, 0), //To avoid the jum pf the box at the beginning
    material: boxPhysMat
});
world.addBody(boxBody);

boxBody.angularVelocity.set(0, 10, 0); //To rotate the body and set the speed of rotation of each axis
boxBody.angularDamping = 0.5; // To slow down the speed of box

const groundBoxContactMat = new CANNON.ContactMaterial( // an instance of the contact material class in which first two arguments must be the two materials and third i an optional object where we specify what should happen when two materials meet
    groundPhysMat,
    boxPhysMat,
    {friction: 0.04} //as we want to make the object look slippery so the frction sould be very low
);

world.addContactMaterial(groundBoxContactMat);


//body for sphere material
const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    mass: 4,
    shape: new CANNON.Sphere(2), // 2 is radius of the sphere which is same as that set in three js property
    position: new CANNON.Vec3(0, 10, 0),
    material: spherePhysMat
});
world.addBody(sphereBody);

sphereBody.linearDamping = 0.21; // We have seen that the object once fallen mooves with the constant speed but this is not the case with real life as in real life the speed slows down due to air resistance 


const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.9}
);

world.addContactMaterial(groundSphereContactMat);

const timeStep = 1 / 60;

function animate() {
    world.step(timeStep);

    //To get fusion of the mesh and the physics body
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



//Step1: Create a physics world
//step2: Create a simple mesh geometry
//step3: Create a body which is governed by physics phenomenon
//step4: Merge the mesh geometry and physics body

// Material in cannon js
//It is different from materil property in three js as it governs that how a body should react when it gets in the contact of other material

