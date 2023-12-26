
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
