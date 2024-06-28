import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0x000000); // Black color


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 6, 6);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);

const helper = new THREE.AxesHelper(20);
scene.add(helper);

const mouse = new THREE.Vector2(); //normalised position of cursor needed for raycaster
const intersectionPoint = new THREE.Vector3(); //intersection point of ray and the plane(coordinates of mouse click)
const planeNormal = new THREE.Vector3(); //unit normal vector that indicates the direction of plane
const plane = new THREE.Plane(); //the plane to be created whenever we chnage the position of the cursor
const raycaster = new THREE.Raycaster(); // going to emit the ray betwen the camera and cursor


window.addEventListener('click', function(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1; // To keep update in the mouse variabele with the normalised coordinates of the cursor
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; 
    //To keep update in the planeNormal with the coordinates of the unit normal vector
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    //To create ray  by calling set from camera
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
   const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
   const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xFFEA00,
    metalness: 0, 
    roughness: 0
   });
   const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
   scene.add(sphereMesh);
   sphereMesh.position.copy(intersectionPoint);
});

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});





// We are making the balls on mouse clicking but the problem is we do not have any built in funtion in three js to convert mouse position from window coordinate system to three js world coordinae system
//Solution:
// we need to create an ivisible plane always facing the camera and also update every time a mouse movement is detected and this can be done by
// setFromNormalAndCoplanarPoint(unitVector, originPoint)
//unitvecror will be going to postion the camera and originPoint is origin of world's coorinate system

//step2: we need to cretae an object pn mouse click where the plane intersects the ray between camera and cursor
// And this can be done by raycasterclass


//usage of every function
// planeNormal.copy(camera.position).normalize();
// This line copies the position of the camera to the planeNormal vector and then normalizes it. This creates a unit vector in the direction of the camera's position, which will be used as the normal vector for the plane.

// plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
// Here, you're setting the plane using the normal vector (planeNormal) and a point on the plane (scene.position). This defines the position and orientation of the plane in the scene.

// raycaster.setFromCamera(mouse, camera);
// This line sets up the raycaster to emit a ray from the camera through the mouse coordinates (mouse) in the scene.
// javascript
// Copy code
// raycaster.ray.intersectPlane(plane, intersectionPoint);
// Here, you're using the intersectPlane method of the raycaster to calculate the intersection point of the ray and the plane. The resulting intersection point is stored in the intersectionPoint vector.