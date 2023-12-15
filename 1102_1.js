import * as THREE from "three";
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {
	      const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "assets/cap.mind"
      		});
	        const {renderer, scene, camera} = mindarThree;
		const anchor = mindarThree.addAnchor(0);

		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const cube = new THREE.Mesh( geometry, material );

		anchor.group.add(cube);

		await mindarThree.start();
		renderer.setAnimationLoop(() => {
		  renderer.render(scene, camera);
		});

	}
	start();



	//const scene = new THREE.Scene();
	//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

/*
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor (0, 0);
	renderer.clear(0x777777);
	document.body.appendChild( renderer.domElement );
*/
/*
	scene.add( cube );

	camera.position.z = 5;

	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}
	animate();*/
});
