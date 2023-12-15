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
			imageTargetSrc: "assets/drugs_and_cup.mind",
			maxTrack: 3,
			uiLoading: "no", 
			uiScanning: "yes", 
			uiError: "yes"
      		});
	        const {renderer, scene, camera} = mindarThree;

		const model = await tmImage.load("assets/model/model.json", "assets/model/metadata.json");
		const maxPredictions = model.getTotalClasses();

		var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);

		const anchor_kvad = mindarThree.addAnchor(0);//1

		const raccoon_video = document.getElementById("RAR");
		//const raccoon_video = await loadVideo("assets/red_alert_raccoon.mp4");
		const video_texture = new THREE.VideoTexture(raccoon_video);

		//720 × 1280
		// 1  × ?
		const geometry = new THREE.PlaneGeometry( 1, 1280/720.0 );
		const material = new THREE.MeshBasicMaterial( { map: video_texture } );
		const plane = new THREE.Mesh( geometry, material );

		anchor_kvad.group.add(plane);

		anchor_kvad.onTargetFound = () => {
			raccoon_video.play();
		}
		anchor_kvad.onTargetLost = () => {
			raccoon_video.pause();
		}

		const anchor_diaz = mindarThree.addAnchor(1); //2

		const texture = new THREE.TextureLoader().load("assets/face_orig.png"); 
		const material2 = new THREE.MeshBasicMaterial( { map:texture } );
		const plane2 = new THREE.Mesh( geometry, material2 );

		anchor_diaz.group.add(plane2);

		const anchor_cup = mindarThree.addAnchor(2); //3

		const loader = new GLTFLoader();
		let stone = false, paper = false, scissors = false;
		let mixer_stone = false, mixer_paper = false, mixer_scissors = false;

		loader.load(
			// resource URL
			'assets/stone.glb',
			// called when the resource is loaded
			function (model) {
				console.log("Вдалось завантажити модель каменя!", model);
				stone = model;
				anchor_cup.group.add(model.scene);
				model.scene.scale.set(0.08, 0.08, 0.08);
				model.scene.position.set(-1, 0, 0);
				mixer_stone = new THREE.AnimationMixer(model.scene);
				for(let i=0;i<model.animations.length;i++)
					mixer_stone.clipAction(model.animations[i]).play();
				/*
				gltf.animations; // Array<THREE.AnimationClip>
				gltf.scene; // THREE.Group
				gltf.scenes; // Array<THREE.Group>
				gltf.cameras; // Array<THREE.Camera>
				gltf.asset; // Object
				*/

			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% моделі каменя завантажено" );
			},
			// called when loading has errors
			function ( error ) {
				console.log("Не вдалось завантажити модель каменя");
			}
		);


		loader.load(
			'assets/scissors.glb',
			function (model) {
				console.log("Вдалось завантажити модель 2!" , model);
				scissors = model;
				anchor_cup.group.add(model.scene);
				model.scene.scale.set(0.15, 0.15, 0.15);
				model.scene.position.set(0, -0.7, 0);
				mixer_scissors = new THREE.AnimationMixer(model.scene);
				for(let i=0;i<model.animations.length;i++)
					mixer_scissors.clipAction(model.animations[i]).play();
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% моделі 2 завантажено" );
			},
			function ( error ) {
				console.log("Не вдалось завантажити модель 2");
			}
		);

		loader.load(
			'assets/paper.glb',
			(model) => {
				console.log("Вдалось завантажити модель 3!", model);
				paper = model;
				anchor_cup.group.add(model.scene);
				//model.scene.visible = false;
				model.scene.scale.set(0.08, 0.08, 0.08);
				model.scene.position.set(+1, 0, 0);
				paper = new THREE.AnimationMixer(model.scene);
				for(let i=0;i<model.animations.length;i++)
					mixer_paper.clipAction(model.animations[i]).play();
			},
			( xhr ) => {
				console.log( ( xhr.loaded / xhr.total * 100 ) + "% моделі 3 завантажено" );
			},
			( error ) => {
				console.log("Не вдалось завантажити модель 3");
			}
		);

		const clock = new THREE.Clock();

		await mindarThree.start();

		let counter = 1;

		let video = mindarThree.video;

		renderer.setAnimationLoop(async() => {
			plane2.rotation.z += 0.1;
			const delta = clock.getDelta();
			if(mixer_stone)
				mixer_stone.update(delta);
			if(mixer_scissors)
				mixer_scissors.update(delta);
			if(mixer_paper)
				mixer_paper.update(delta);

			if(counter % 10 == 0)
			{
				//check
				const prediction = await model.predict(video);
				let max_prob = -1, elem = -1;
				for(let i=0;i<prediction.length;i++)
					if(prediction[i].probability > max_prob)
					{
						max_prob = prediction[i].probability;
						elem = i;
					}
				console.log(prediction[elem].className, max_prob);
/*
				if(stone && scissors && paper)
				{
					if(elem == 0) // stone
					{
						stone.scene.visible = true;
						scissors.scene.visible = false;
						paper.scene.visible = false;
					}

					if(elem == 1) // scissors
					{
						stone.scene.visible = false;
						scissors.scene.visible = true;
						paper.scene.visible = false;
					}

					if(elem == 2) // paper
					{
						stone.scene.visible = false;
						scissors.scene.visible = false;
						paper.scene.visible = true;
					}
				}
*/
/*
				let str = "Визначено: ";
				for (let i = 0; i < maxPredictions; i++) 
					str = str + prediction[i].className + ": " + prediction[i].probability.toFixed(2) + "\n";
				console.log(str);
*/
			}
			counter += 1;
			renderer.render(scene, camera);
		});

	}
	start();

});
