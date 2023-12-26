



import * as THREE from "three";

import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


import { MindARThree } from 'mindar-image-three';

export const loadVideo = (path) => {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
			video.addEventListener("loadeddata", () => {
				video.setAttribute("playsinline", "");
				resolve(video);
			});
		video.src = path;
	});
}

document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {
	      const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "cosmic_ship.mind",
			maxTrack: 2,
			uiLoading: "no", 
			uiScanning: "yes", 
			uiError: "yes"
      		},
      		{
			container: document.body,
			imageTargetSrc: "houdini.mind",
			maxTrack: 2,
			uiLoading: "no", 
			uiScanning: "yes", 
			uiError: "yes"
      		});
	        const {renderer, scene, camera} = mindarThree;

		var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);

		const anchor_kvad = mindarThree.addAnchor(0);//1

		const raccoon_video = document.getElementById("VID");
		//const raccoon_video = await loadVideo("assets/red_alert_raccoon.mp4");
		const video_texture = new THREE.VideoTexture(raccoon_video);

		//720 × 1280
		// 1  × ?
		const geometry = new THREE.PlaneGeometry( 1, 1 );
		const material = new THREE.MeshBasicMaterial( { map: video_texture } );
		const plane = new THREE.Mesh( geometry, material );

		anchor_kvad.group.add(plane);

		anchor_kvad.onTargetFound = () => {
			raccoon_video.play();
		}
		anchor_kvad.onTargetLost = () => {
			raccoon_video.pause();
		}


		const clock = new THREE.Clock();

		await mindarThree.start();

		let counter = 1;

		let video = mindarThree.video;

		renderer.setAnimationLoop(async() => {
			renderer.render(scene, camera);
		});

        // Якір для маркера 3D-моделі
        const anchor_model = mindarThree.addAnchor(1);

        const loader = new GLTFLoader();
        loader.load("../weekday/Cactus.gltf", (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            anchor_model.group.add(model);
        });

        anchor_model.onTargetFound = () => {
            // Логіка для відображення 3D-моделі при розпізнаванні маркера
        }

        anchor_model.onTargetLost = () => {
            // Логіка для приховування 3D-моделі, коли маркер втрачено
        }

        await mindarThree.start();

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });


	}


	start();


});

