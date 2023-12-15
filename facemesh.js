import * as THREE from "three";
import { MindARThree } from 'mindar-face-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {
	      const mindarThree = new MindARThree({
			container: document.body,
			uiLoading: "yes", uiScanning: "yes", uiError: "yes",
      		});

	        const {renderer, scene, camera} = mindarThree;

		const anchor = mindarThree.addAnchor(454);

		const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const cube = new THREE.Mesh( geometry, material );

		anchor.group.add(cube);

		const eyes = mindarThree.addAnchor(6);
		const loader = new THREE.TextureLoader();

		const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 144/493), 
			new THREE.MeshBasicMaterial( { map: loader.load("assets/eyes.png"), transparent: true, opacity: 0.5 } ));

		plane.scale.set(0.9, 0.9, 0.9);
		plane.position.set(1.5,0.25,0);

		eyes.group.add(plane);

		new GLTFLoader().load("assets/cyclops_sunglasses.glb", 
				(model) => {
					model.scene.scale.set(0.005, 0.005, 0.005);
					//model.scene.position.z=-1;
					model.scene.position.y=-0.4;
					console.log(model);
					eyes.group.add(model.scene);	
				}
		);

		const light1 = new THREE.AmbientLight( 0xFFFFFF, 1.5 ); // soft white light
		scene.add( light1 );
		const light2 = new THREE.HemisphereLight( 0xffffff, 0xdddddd, 1.5 ); // soft white light
		scene.add( light2 );

		const faceMesh = mindarThree.addFaceMesh();
		faceMesh.material.transparent = true;
		//faceMesh.material.wireframe = true;
		//faceMesh.material.opacity = 0.5;
		faceMesh.material.map = loader.load("assets/my_mask.png");
		scene.add(faceMesh);

		await mindarThree.start();

		//mindarThree.video.style.display = "none";

		renderer.setAnimationLoop( () => {
		  	renderer.render(scene, camera);
		});

	}
	start();
});


