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


		// the link to your model provided by Teachable Machine export panel

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
		const model = await tmImage.load("assets/model/model.json", "assets/model/metadata.json");
		const maxPredictions = model.getTotalClasses();
//		console.log("maxPredictions = ", maxPredictions);
//		console.log("video = ", video);

		await mindarThree.start();

		let counter = 1;

		renderer.setAnimationLoop(async () => {
			counter += 1;
			if(counter % 10 == 0)
			{
  			// predict can take in an image, video or canvas html element
				const prediction = await model.predict(mindarThree.video);
				let str = "";
				let number = 0, prob = prediction[0].probability;
				for (let i = 0; i < maxPredictions; i++) 
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

