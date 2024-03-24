import * as THREE from 'three';
import { FBXLoader } from '/libs/FBXLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById("container")
const loader = new FBXLoader();

const scrollSens = 30;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    alpha: true,
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor( 0x000000, 0 )
renderer.setSize( window.innerWidth, window.innerHeight-10);
loader.setResourcePath('/textures/');
renderer.render(scene, camera)
camera.position.setZ(30);


const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
const dirLight2 = new THREE.DirectionalLight( 0x002288, 3 );
const ambientLight = new THREE.AmbientLight( 0x555555 );

dirLight1.position.set( 1, 1, 1 );
dirLight2.position.set( - 1, - 1, - 1 );


scene.add( dirLight1 );
scene.add( dirLight2 );
scene.add( ambientLight );


let obj;

loader.load(
    'rose.fbx',
    function (object) {
        obj = object;
        obj.castShadow = true;
        obj.position.y = (container.scrollTop / scrollSens) - 80
        obj.position.z = -5
        obj.rotation.y =container.scrollTop /500
        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.material) {
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    materials.forEach(material => {
                        if (material.map) {
                            material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                            material.map.minFilter = THREE.NearestFilter;
                            material.map.magFilter = THREE.NearestFilter;
                        }
                    });
                }
            }
        });
        scene.add(object);
    },
    function (xhr) {
        if ((xhr.loaded / xhr.total * 100) == 100) {
            document.getElementById("trailer").classList.add("hidden")

            setTimeout(() => {
            }, 500)
        }
    },

);

function detectScroll(e) {
    const targetPosition = obj.position.clone();
    targetPosition.y = (container.scrollTop / scrollSens) - 80
    obj.position.lerp(targetPosition, 0.5 * Math.PI);
    obj.rotation.y = container.scrollTop /500
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera)

}



animate()
document.getElementById("container").addEventListener("scroll", detectScroll)
window.addEventListener( 'resize', onWindowResize );
