import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import gsap from 'gsap';
import { getBrick } from './brick';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const scene1 = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);
var frustumSize = 3;
var aspect = 0.5 * sizes.width / sizes.height;
let num = 15;
let space = 0.05;
let gr = new THREE.Group();
scene.add(gr);
// scene.add(getBrick(10, 15));
for (let i = 0; i < 15; i++) {
    gr.add(getBrick(i, 15, space));
}

let gr1 = new THREE.Group();
scene1.add(gr1);

for (let i = 0; i < 15; i++) {
    gr1.add(getBrick(i, 15, space));
}
gr1.rotation.x = Math.PI / 2;
gr1.position.y = -0.2;

gr.position.x = aspect * frustumSize / 2;
gr1.position.x = -aspect * frustumSize / 2;
/**
 * Sizes
 */

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Add directional light from top 
const light = new THREE.DirectionalLight(0xffffff, 1);
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);
light1.position.set(0, 1, 0);
scene.add(light);
scene1.add(light1);
// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const ambientLight1 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
scene1.add(ambientLight1);
/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

var camera = new THREE.OrthographicCamera(-aspect * frustumSize / 2, aspect * frustumSize / 2, frustumSize / 2, -frustumSize / 2, 0.1, 100);
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// set renderer scissorTest to true
renderer.setScissorTest(true);
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime();
    gr.rotation.y = Math.PI * 2 * elapsedTime * 0.1;
    gr1.rotation.y = Math.PI * 2 * elapsedTime * 0.1;
    // Update uniforms
    material.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.setViewport(0, 0, sizes.width / 2, sizes.height);
    renderer.setScissor(0, 0, sizes.width / 2, sizes.height);
    renderer.render(scene, camera);

    renderer.setViewport(sizes.width / 2, 0, sizes.width / 2, sizes.height);
    renderer.setScissor(sizes.width / 2, 0, sizes.width / 2, sizes.height);
    renderer.render(scene1, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();