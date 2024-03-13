import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);
  
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set( 5, 2, 8 );

  let mixer;
  const clock = new THREE.Clock();
  
  const renderer = new THREE.WebGLRenderer({antialias: true});
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  
  // set up the background
  scene.background = new THREE.Color( '#dd0033' );
  scene.environment = pmremGenerator.fromScene( new RoomEnvironment( renderer ), 0.04 ).texture;
  
  // set up controls

  const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;



  useEffect(() => {

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    var animate = function () {
      requestAnimationFrame(animate);
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

//   window.onresize = function () {

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );

// };


  
  return (
    <div ref={refContainer}></div>

  );
}

export default MyThree