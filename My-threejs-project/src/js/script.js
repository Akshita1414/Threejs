import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import nebula from '../img/nebula.jpg';
import stars from '../img/stars.jpg';

const renderer = new THREE. WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
// for three.js you need scene, camera and then elements
const scene = new THREE.Scene();

//Camera are of two types perspective camera and orthographic camera
//perspective: that changes with the size of object
//orthgraphic: that do not change with size of object

const camera = new THREE.PerspectiveCamera(
    45,                                    // field of view(usually between 40 to 80)
    window.innerWidth/window.innerHeight, //aspect
    0.1,                                  //Near clicking plane
    1000                                  //far clicking plane
);

const orbit = new OrbitControls(camera , renderer.domElement);



const axesHelper = new THREE.AxesHelper(3);   //5 represents the length of the axis
scene.add(axesHelper);

// camera.position.z = 5;
// camera.position.y = 2;

camera.position.set(-10,30,30);   // (X,y,z)
orbit.update();

//ste1,2,3
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry,boxMaterial);
scene.add(box);

//Plane geometry
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial(
    {color: 0xFFFFFF,
     side: THREE.DoubleSide//Taaki vo whitw vla dono side aajye
});
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; //taaki plane grid k uppar aajye
//Kyuki plane sphere se shadow receive krra h toh ispe shadow property set krnge
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30,100);//30=surfac area of grid and 100 = in how many squares it should be divided
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4,10,10);
const sphereMaterial = new THREE.MeshStandardMaterial
({  color: 0x0000FF,
    wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);
sphere.position.set(-10,10,0);
//kyuki sphere cast krra h shadow
sphere.castShadow = true;

//Lights(Mesh material is not affected by light)
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);


//FOR DIRECTIONAL LIGHT
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF , 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;


// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight,5); //5= size of that wjite square
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

//FOR SPOTLIGHT
//1) creat a spotlight opbct, 2) position itm 3) create a spotlightHelper
const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//fog in threejs
//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200); //color,new and far
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);//color,density

//renderer.setClearColor(0xFFEA00);// To change color of background

//To set an image as a background
const textureLoader = new THREE.TextureLoader();
 scene.background = textureLoader.load(stars);
//  const cubeTextureLoader = new THREE.CubeTextureLoader();
//  scene.background = cubeTextureLoader.load([
//     nebula,
//     nebula,
//     stars,
//     stars,
//     stars,
//     stars
// ]);

//How to add a textute to a geometry
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
    //color: 0x00FF00,
    map: textureLoader.load(nebula)
});
//To get different grading on each phase of cube
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
]
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);
//box2.material.map = textureLoader.load(nebula);


const gui = new dat.GUI();

const options = {
      sphereColor: '#ffea00',
      wireframe: false,
      speed :  0.01,
      angle : 0.2,
      penumbra: 0,
      intensity: 1
};

gui.addColor(options, 'sphereColor').onChange(function(e){
      sphere.material.color.set(e);
});

// gui.add(options, 'wireframe').onChange(function(e){
//     sphere.material.wireframe = e;
// });

gui.add(options , 'speed' , 0 , 0.1);
gui.add(options , 'angle' , 0 , 1);
gui.add(options , 'penumbra' , 0 , 1);
gui.add(options , 'intensity' , 0 , 1);


let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove',  function(e){
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;// x poition of the cursor
    mousePosition.y = (e.clientY / this.window.innerWidth) * 2 + 1;//y position of the cursor
});

const rayCaster = new THREE.Raycaster();


function animate(time)
{
    box.rotation.x = time/1000;
    box.rotation.y = time/1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    renderer.render(scene,camera);

}

renderer.setAnimationLoop(animate);


//Step1: Creation of geometry that we want to add to the scene
//Step2: Creation of material 
//Step3: Cover the geometry with the material




