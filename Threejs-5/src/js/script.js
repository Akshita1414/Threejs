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

const world = new CANNON.World({gravity: new CANNON.Vec3(0, -9.81, 0)});

const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
})
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
scene.add(planeMesh);

const planePhysMat = new CANNON.Material();
const planeBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
    material: planePhysMat
});
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody);

const timestep = 1 / 60;

const mouse = new THREE.Vector2(); //normalised position of cursor needed for raycaster
const intersectionPoint = new THREE.Vector3(); //intersection point of ray and the plane(coordinates of mouse click)
const planeNormal = new THREE.Vector3(); //unit normal vector that indicates the direction of plane
const plane = new THREE.Plane(); //the plane to be created whenever we chnage the position of the cursor
const raycaster = new THREE.Raycaster(); // going to emit the ray betwen the camera and cursor

const meshes = [];
const bodies = [];



window.addEventListener('click', function(e){
    // mouse.x = (e.clientX / window.innerWidth) * 2 - 1; // To keep update in the mouse variabele with the normalised coordinates of the cursor
    // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; 

    // //To keep update in the planeNormal with the coordinates of the unit normal vector
    // planeNormal.copy(camera.position).normalize();
    // plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);

    // //To create ray  by calling set from camera

    // raycaster.setFromCamera(mouse, camera);
    // raycaster.ray.intersectPlane(plane, intersectionPoint);
   const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
   const sphereMat = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xFFFFFF, //To generate random colors
    metalness: 0, 
    roughness: 0
   });
   const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
   scene.add(sphereMesh);
//    sphereMesh.position.copy(intersectionPoint);
   
   const spherePhysMat = new CANNON.Material();
   const sphereBody = new CANNON.BODY({
    mass: 0.3,
    shape: new CANNON.Sphere(0.125),
    position: new CANNON.Vec3(intersectionPoint.x. intersectionPoint.y, intersectionPoint.z), //By doing this the sphere will get their positions on click and the mesh will get its position with the body
    material: spherePhysMat
    });

   world.addBody(sphereBody);

   const planeSphereContactMat = new CANNON.ContactMaterial(
   planePhysMat,
   spherePhysMat,
   {restitution: 0.3}
   );

   world.addContactMaterial(planeSphereContactMat);

   meshes.push(sphereMesh);
   bodies.push(sphereBody);
});

function animate() {
    world.step(timestep);

    planeMesh.position.copy(planeBody.position.copy);
    planeMesh.quaternion.copy(planeBody.quaternion);

    for(let i = 0; i < meshes.length; i++)
    {
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});





//Problem is here we are  reating the sphere bodies dynamically so in three js we do not have any function whre we can merge the body and geometry in animate function
//Solution: Create arrays for the meshes and bodies each time a ball is created, its body is stored in the first index of mesh array and its body in first index of boy array

//Problem: No matter where I click the balls are falling only on the centre og the plane and it is because the position of the mesh is getting updated by the poition of the body
//Solution: 