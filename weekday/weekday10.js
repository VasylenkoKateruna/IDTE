import * as THREE from "three";
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async() => {
	      const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "week9.mind",
			uiLoading: "yes", uiScanning: "no", uiError: "yes",
      		});
	        const {renderer, scene, camera} = mindarThree;

		const anchor = mindarThree.addAnchor(0);

		const results = document.getElementById("results");

		const model = handPoseDetection.SupportedModels.MediaPipeHands;
		const detectorConfig = {
		  runtime: 'mediapipe', // or 'tfjs',
		  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
		  modelType: 'full'
		}
		const detector = await handPoseDetection.createDetector(model, detectorConfig);


		await mindarThree.start();

		let counter = 1;

	        renderer.setAnimationLoop(async () => {
            counter += 1;
            if(counter % 10 == 0) {
                const hands = await detector.estimateHands(mindarThree.video);
                let str = "";
                if(hands.length == 0) {
                    str = "Не видно рук";
                } else {
                    hands.forEach(hand => {
                        const handType = hand["handedness"] == "Left" ? "ліва" : "права";
                        str += `Визначено ${handType} руку з ймовірністю ${hand["score"].toFixed(2)}\n`;

                        // Перерахування всіх пальців
                        const fingers = ["Великий", "Вказівний", "Середній", "Безіменний", "Мізинець"];
                        const mcpIndices = [2, 5, 9,13, 17];
                        const tipIndices = [4, 8, 12, 16, 20];

                        fingers.forEach((finger, index) => {
                            if (index < fingers.length - 1) {
                                const fingerMCP = hand["keypoints"][mcpIndices[index]];
                                const fingerTIP = hand["keypoints"][tipIndices[index]];
                                const nextFingerMCP = hand["keypoints"][mcpIndices[index + 1]];

                                const vectorCurrent = { x: fingerTIP.x - fingerMCP.x, y: fingerTIP.y - fingerMCP.y };
                                const vectorNext = { x: hand["keypoints"][tipIndices[index + 1]].x - nextFingerMCP.x, y: hand["keypoints"][tipIndices[index + 1]].y - nextFingerMCP.y };

                                const angle = calculateAngleBetweenVectors(vectorCurrent, vectorNext);
                                str += `Кут між ${finger} і ${fingers[index + 1]} пальцями: ${angle.toFixed(2)} градусів\n`;
                            }
                        });
                    });
                }
                results.innerHTML = str;
            }
            renderer.render(scene, camera);
        });
    }
	start();
});

[{
        "keypoints": [
            {
                "x": 197.53149032592773,
                "y": 385.5098819732666,
                "name": "wrist"
            },
            {
                "x": 254.3394660949707,
                "y": 387.5148010253906,
                "name": "thumb_cmc"
            },
            {
                "x": 308.34062576293945,
                "y": 348.3779239654541,
                "name": "thumb_mcp"
            },
            {
                "x": 344.3515396118164,
                "y": 310.0511169433594,
                "name": "thumb_ip"
            },
            {
                "x": 375.6435012817383,
                "y": 283.55589866638184,
                "name": "thumb_tip"
            },
            {
                "x": 301.02893829345703,
                "y": 269.42665100097656,
                "name": "index_finger_mcp"
            },
            {
                "x": 336.98341369628906,
                "y": 227.308931350708,
                "name": "index_finger_pip"
            },
            {
                "x": 361.41414642333984,
                "y": 200.06760120391846,
                "name": "index_finger_dip"
            },
            {
                "x": 383.07762145996094,
                "y": 175.13490200042725,
                "name": "index_finger_tip"
            },
            {
                "x": 270.1586723327637,
                "y": 248.65047454833984,
                "name": "middle_finger_mcp"
            },
            {
                "x": 295.7938575744629,
                "y": 192.86500453948975,
                "name": "middle_finger_pip"
            },
            {
                "x": 317.3043441772461,
                "y": 157.44574069976807,
                "name": "middle_finger_dip"
            },
            {
                "x": 336.9931411743164,
                "y": 126.04315280914307,
                "name": "middle_finger_tip"
            },
            {
                "x": 237.1446990966797,
                "y": 243.24560165405273,
                "name": "ring_finger_mcp"
            },
            {
                "x": 256.21530532836914,
                "y": 188.00436973571777,
                "name": "ring_finger_pip"
            },
            {
                "x": 273.8829803466797,
                "y": 152.04920768737793,
                "name": "ring_finger_dip"
            },
            {
                "x": 290.7225799560547,
                "y": 118.52366924285889,
                "name": "ring_finger_tip"
            },
            {
                "x": 202.15801239013672,
                "y": 249.92159843444824,
                "name": "pinky_finger_mcp"
            },
            {
                "x": 215.14463424682617,
                "y": 203.50902557373047,
                "name": "pinky_finger_pip"
            },
            {
                "x": 225.79917907714844,
                "y": 172.23938941955566,
                "name": "pinky_finger_dip"
            },
            {
                "x": 237.3473358154297,
                "y": 142.08539485931396,
                "name": "pinky_finger_tip"
            }
        ],
        "keypoints3D": [
            {
                "x": -0.04285227879881859,
                "y": 0.08251459151506424,
                "z": 0.00616455078125,
                "name": "wrist"
            },
            {
                "x": -0.00575961172580719,
                "y": 0.07588481903076172,
                "z": -0.0020122528076171875,
                "name": "thumb_cmc"
            },
            {
                "x": 0.022535571828484535,
                "y": 0.05824936926364899,
                "z": -0.01123809814453125,
                "name": "thumb_mcp"
            },
            {
                "x": 0.04843226820230484,
                "y": 0.035079292953014374,
                "z": -0.024322509765625,
                "name": "thumb_ip"
            },
            {
                "x": 0.06628511846065521,
                "y": 0.01033443957567215,
                "z": -0.027557373046875,
                "name": "thumb_tip"
            },
            {
                "x": 0.02479442209005356,
                "y": 0.010220297612249851,
                "z": 0.00455474853515625,
                "name": "index_finger_mcp"
            },
            {
                "x": 0.043664343655109406,
                "y": -0.012600492686033249,
                "z": -0.007457733154296875,
                "name": "index_finger_pip"
            },
            {
                "x": 0.055461518466472626,
                "y": -0.02506978064775467,
                "z": -0.0136260986328125,
                "name": "index_finger_dip"
            },
            {
                "x": 0.0659392699599266,
                "y": -0.03989598900079727,
                "z": -0.045440673828125,
                "name": "index_finger_tip"
            },
            {
                "x": 0.003315293462947011,
                "y": -0.003043166594579816,
                "z": 0.006519317626953125,
                "name": "middle_finger_mcp"
            },
            {
                "x": 0.019359353929758072,
                "y": -0.03605690225958824,
                "z": -0.00524139404296875,
                "name": "middle_finger_pip"
            },
            {
                "x": 0.029293233528733253,
                "y": -0.055772580206394196,
                "z": -0.0242767333984375,
                "name": "middle_finger_dip"
            },
            {
                "x": 0.043397996574640274,
                "y": -0.07553688436746597,
                "z": -0.047515869140625,
                "name": "middle_finger_tip"
            },
            {
                "x": -0.017116177827119827,
                "y": -0.009344266727566719,
                "z": -0.0030612945556640625,
                "name": "ring_finger_mcp"
            },
            {
                "x": -0.003490135073661804,
                "y": -0.03723590821027756,
                "z": -0.0135040283203125,
                "name": "ring_finger_pip"
            },
            {
                "x": 0.004819301888346672,
                "y": -0.0552835613489151,
                "z": -0.0299224853515625,
                "name": "ring_finger_dip"
            },
            {
                "x": 0.016366606578230858,
                "y": -0.0750209167599678,
                "z": -0.045867919921875,
                "name": "ring_finger_tip"
            },
            {
                "x": -0.03948356956243515,
                "y": -0.003305613063275814,
                "z": -0.01073455810546875,
                "name": "pinky_finger_mcp"
            },
            {
                "x": -0.030445393174886703,
                "y": -0.024528905749320984,
                "z": -0.015625,
                "name": "pinky_finger_pip"
            },
            {
                "x": -0.02156277559697628,
                "y": -0.04413274675607681,
                "z": -0.027069091796875,
                "name": "pinky_finger_dip"
            },
            {
                "x": -0.014370672404766083,
                "y": -0.06077410280704498,
                "z": -0.038543701171875,
                "name": "pinky_finger_tip"
            }
        ],
        "score": 0.96533203125,
        "handedness": "Left"
    }
]
});

function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function calculateAngleBetweenVectors(vecA, vecB) {
    const dotProduct = vecA.x * vecB.x + vecA.y * vecB.y;
    const magnitudeA = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y);
    const magnitudeB = Math.sqrt(vecB.x * vecB.x + vecB.y * vecB.y);
    const cosTheta = dotProduct / (magnitudeA * magnitudeB);
    return Math.acos(cosTheta) * (180 / Math.PI); // Переведення радіанів у градуси
}
