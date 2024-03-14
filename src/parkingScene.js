import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useEffect, useRef } from "react";

function ParkingScene() {
    const refContainer = useRef(null);

    // set up scene/clock 
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // set up camera
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0.5, 2);

    // set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // set up background
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.background = new THREE.Color('#685ed1');
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    useEffect(() => {
        let carModel, personModel;

        // use doc body as mount point of ThreeJS scene
        document.body.appendChild(renderer.domElement);

        // set up controls
        const controls = new FirstPersonControls(camera, renderer.domElement);
        controls.movementSpeed = 1.2;
        controls.lookSpeed = 0.2;
        controls.lookVertical = true;

        // set up ref container as alt mount point of renderer
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        // set up lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        // load parking lot
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

        // load person
        loader.load(
            'models/person/scene.gltf',
            function (gltf) {
                personModel = gltf.scene;
                personModel.position.set(0, 0.15, 0.2);
                personModel.scale.set(0.1, 0.1, 0.1);
                scene.add(personModel);
            },
            undefined,
            function (error) {
                console.error('Error loading person model:', error);
            }
        );

        // load police car
        loader.load(
            'models/police_car/scene.gltf',
            function (gltf) {
                carModel = gltf.scene;
                carModel.position.set(0.5, 0.07, 0.5);
                carModel.rotation.y = -(Math.PI / 3);
                carModel.scale.set(0.07, 0.07, 0.07);
                scene.add(carModel);
            },
            undefined,
            function (error) {
                console.error('Error loading car model:', error);
            }
        );

        // set up animation
        const animate = function () {
            requestAnimationFrame(animate);

            // police car and person animation
            if (carModel && personModel) {
                // collision detection
                if (carModel.position.distanceTo(personModel.position) > 0.27) {
                    // move person forward
                    personModel.position.z += 0.001;
                    // Move car towards person
                    carModel.position.x -= 0.01; // Adjust as needed for speed and direction
                }
            }

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
