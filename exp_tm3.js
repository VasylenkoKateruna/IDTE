import * as THREE from "three";
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {
	      const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "assets/cap.mind",
			uiLoading: "yes", uiScanning: "no", uiError: "yes",
      		});
	        const {renderer, scene, camera} = mindarThree;

		const anchor = mindarThree.addAnchor(0);

		const results = document.getElementById("results");

		const model = await mobilenet.load();

		await mindarThree.start();

		let counter = 1;

		renderer.setAnimationLoop(async () => {
			counter += 1;
			if(counter % 10 == 0)
			{
				const prediction = await model.classify(mindarThree.video);
				let str = "";
				let number = 0, prob = prediction[0].probability;
				for (let i = 0; i < prediction.length; i++) 
				{
					str = str + prediction[i].className + ": " + prediction[i].probability.toFixed(2) + "\n";
					if (prediction[i].probability > prob)
					{
						number = i;
						prob = prediction[i].probability;
					}
				}
				if (prob >= 0.5)
					str += "\n"+prediction[number].className;

				results.innerHTML = str;
			}
		  	renderer.render(scene, camera);
		});

	}
	start();
});


