import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { useEffect, useRef } from "react";

function ParkingScene() {
  const refContainer = useRef(null);

  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );

  // const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(0, 0.5, 2); 

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.background = new THREE.Color('#685ed1');
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  useEffect(() => {

  document.body.appendChild( renderer.domElement );


    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 1.2;
    controls.lookSpeed = 0.2; 
    controls.lookVertical = true;

    refContainer.current && refContainer.current.appendChild(renderer.domElement);

    // Your existing lights and model loading
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      'models/parking_lot/scene.gltf',
      function (gltf) {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded'); 
      },
      function (error) {
        console.error('Error loading model:', error);
      }
    );

    const animate = function () {
      requestAnimationFrame(animate);
      controls.update(clock.getDelta()); 
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  return (
    <div ref={refContainer}></div>
  );
}

export default ParkingScene;
