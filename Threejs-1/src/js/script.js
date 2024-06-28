import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js' ;

import starsTexture from '../img/stars.jpg' ;
import sunTexture from '../img/sun.jpg' ;
import mercuryTexture from '../img/mercury.jpg' ;
import venusTexture from '../img/venus.jpg' ;
import earthTexture from '../img/earth.jpg' ;
import marsTexture from '../img/mars.jpg' ;
import jupiterTexture from '../img/jupiter.jpg' ;
import saturnTexture from '../img/saturn.jpg' ;
import saturnRingTexture from '../img/saturn ring.png' ;
import uranusTexture from '../img/uranus.jpg' ;
import uranusRingTexture from '../img/uranus ring.png' ;
import neptuneTexture from '../img/neptune.jpg' ;
import plutoTexture from '../img/pluto.jpg' ;

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

camera.position.set(-90, 140, 140);
// camera.position.set(0, 0, 12);
orbit.update();

const geometry = new THREE.PlaneGeometry(10, 10, 30, 30);
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate(){
    renderer.render(scene, camera);
}



const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunMap = textureLoader.load(sunTexture);
sunMap.colorSpace = THREE.SRGBColorSpace;
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: sunMap
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(size, texture, position, ring)
{
    const map = textureLoader.load(texture);
    map.colorSpace = THREE.SRGBColorSpace;
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: map
    });

    const mesh = new THREE.Mesh(geo, mat);
    //Parent obj
    const obj = new THREE.Object3D();
    obj.add(mesh);

    if(ring){
        const ringMap = textureLoader.load(ring.texture);
        ringMap.colorSpace = THREE.SRGBColorSpace;
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius, 
            ring.outerRadius, 
            32);
        const ringMat = new THREE.MeshBasicMaterial({
             map: ringMap,
             side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);

        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;

    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj};
}

const mercury = createPlanet(3.2 , mercuryTexture, 28);
const saturn = createPlanet(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);


const pointLight = new THREE.PointLight(0xFFFFFF, 30000, 300);//color,intensity,max dist light can reach....ye point light mrcury k loye bnayi h
scene.add(pointLight);

function animate()
{
    //Self rotation
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    //Around sun rottion
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);


    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});





//The parent children relationship makes the position of children to move according to the position of parent
//What is mercuryObj?
//Problem: Planets does not have a same speed as of sun but here since the parent object is sun therefore mercury is rotating at a same speed as of sun
//To fix this we will create a parent object for each planet other than sun and put that planet at a same position as of sun and control the speed of planets using their respective parent objects by rotating each one of them at different speeds
//We will not craete any geomtry and material for each planet objects rather than wew= will create a 3d instance of object



// MERCURY
// const mercuryGeo = new THREE.SphereGeometry(3.2,30,30);
// const mercuryMat = new THREE.MeshStandardMaterial({  // Basic se mercury pr sun ki light pdri thi or vo light dih rha ha ab isse vo dark dikhega coz does not mit light iske liye alg se light source bnynge
//     map: textureLoader.load(mercuryTexture)
// });
// const mercuryO = new THREE.Mesh(mercuryGeo, mercuryMat);

// const mercuryObj = new THREE.Object3D();
// mercuryObj.add(mercury); // To make mercury rotate around sun
// scene.add(mercuryObj);
// mercury.position.x = 28;