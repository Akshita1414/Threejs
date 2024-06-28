import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js' ;

import nebula from '../img/nebula.jpg' ;

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

camera.position.set(0, 0, 12);
orbit.update();

const uniforms = {
    u_time: {type: 'f' , value: 0.0}
}

const geometry = new THREE.PlaneGeometry(10, 10, 30, 30);
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    wireframe: false,
    uniforms
});

const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);

const clock = new THREE.Clock();
function animate(){
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GLSL Tutorial
//variable and constants
//int a = 77             //const float b = 50.00   //int,float,bool
//Type conversion...... int c = int(true);    ... float d = float(2);

//vectors and matrices
//float : vec, int : ivec,  bool : bvec
// vec2vectA = vec2(1.0, 6.0) ....... bvec4vectB = bvec4(true,true,false,false);
//vec4vect = vec4(1.0, 2.0, 3.0, 4.0);
//Hpw to acces eelements
//float a1 = vect.x            //float a1 = vect.r
//float b1 = vectt.y           /float b1 = vectt.g  
//float c1 = vect.z            //float c1 = vect.b
//float d1 = vect.w             /float d1 = vect.a

//Matrices
//Arrays float arrayA[7];
//Structures
//Struct myType{
     //int c1;                  //a.c1 = 10;
     //vect3 c2;              
//}

//myType a;       

//Storage qulifiers
//coordinates: attributes........... time : uniform
//varying: used to transfre the data from vertex shader to fragment shader

//Precisiom qualifiers: lowp,mediump,higjp

//Shaders: A small program written in GLSL
//1) Vertex shader: It i written in main function and is exuted as many number of times as there are no of vertices. For eg: If there are 50 vertices that vertex shader will execute 50 times

//void main(){
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); // Here position is vec3 which contains x,y and z coordinates
    //}


//2) Fragment Shader: It is used to colorise vertices in the mesh after they are positined by vertex shader
//It decomposes the mesh into small fragments and then proceedes to colorise them
//void main(){
   //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); //RGBalpha(opacity)
//
//}
