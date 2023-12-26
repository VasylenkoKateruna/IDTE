import * as THREE from "three";
import { MindARThree } from 'mindar-image-three';

// @formatter: off
const fingersLengthLabel = [
    "великого пальця",
    "вказівного пальця",
    "середнього пальця",
    "безимяного пальця",
    "мізинця"];
const fingersAngleLabel  = [
    "ВЛ та ВК",
    "ВК та СР",
    "СК та БИ",
    "БИ та МІ",
];
// @formatter: on

document.addEventListener("DOMContentLoaded", () =>
{
    const start = async() =>
    {
        const mindArThree = initMindArScene();
        const handDetector = await initHandPoseModel();
        const resultElement = document.querySelector('#resultarea');

        resultElement.innerHTML = "Завантаження моделі...";
        await mindArThree.start();
        await handDetector.estimateHands(mindArThree.video)

        mindArThree.renderer.setAnimationLoop(async() => track(mindArThree, handDetector, resultElement));
    }
    start();
});

function initMindArScene()
{
    const mindarThree = new MindARThree(
        {
            container: document.body,
            imageTargetSrc: "../assets/markers/rutherford_und_thumb/targets.mind",
            maxTrack: 2,
            uiLoading: "no",
            uiScanning: "yes",
            uiError: "yes"
        }
    );
    mindarThree.userData = { counter : 0 };
    return mindarThree;
}

async function initHandPoseModel()
{
    const detectorConfig =
        {
            runtime: 'mediapipe', // or 'tfjs',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
            modelType: 'full'
        };
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detector = await handPoseDetection.createDetector(model, detectorConfig);
    return new Promise((resolve) =>
    {
        resolve(detector);
    });
}


async function track(mindArThree, handDetector, resultElement)
{
    const {scene, camera, renderer, video } = mindArThree;
    const counter = mindArThree.userData.counter;
    mindArThree.userData = { counter : (counter > 10 ? 0 : counter + 1) };
    if (Math.round(counter % 50) === 0)
    {
        const trackResult = await handDetector.estimateHands(video);
        if (trackResult.length === 0)
        {
            resultElement.innerHTML = "Модель не виявила рук.";
        }
        else
        {
            let result = "";
            for (let index = 0; index < trackResult.length; index++)
            //for (let element in trackResult)
            {
                const element = trackResult[index];
                result += "Визначено " + (element["handedness"] === "Left" ? "ліву руку" : "праву руку");
                result += " з ймовірністю " + (element["score"].toFixed(2) * 100) + " %" + "\n";
                // dot index
                for (let dIndex = 0; dIndex < element["keypoints"].length; dIndex++)
                // for (let fingerDot in element["keypoints"])
                {
                    const fingerDot = element["keypoints"][dIndex];
                    result += " (" + fingerDot["name"] + fingerDot["x"].toFixed(0) + ", " + fingerDot["y"].toFixed(0) + ");" + "\n";
                }
                const fingerLength = calculateLength(element["keypoints"]);
                // length index
                for (let lIndex = 0; lIndex < fingerLength.length; lIndex++)
                {
                    result += "Довжина " + fingersLengthLabel[lIndex] + ": " + fingerLength[lIndex].toFixed(0) / 10 + "[mm]";
                    result += " / " + fingerLength[lIndex].toFixed(0) / 100 + "[cm]";
                    result += "\n";
                }
                const fingerAngle = calculateAngle(element["keypoints"]);
                // angle index
                for (let aIndex = 0; aIndex < fingerAngle.length; aIndex++)
                {
                    result += "Кут між  " + fingersLengthLabel[aIndex] + " пальцями: " + fingerAngle[aIndex].toFixed(0) //+ "[degree]";
                    result += "\n";
                }
            }
            resultElement.innerHTML = result;
        }
    }

    renderer.render(scene, camera);
}

function calculateLength(fingerArray)
{
    let fingerLength = [];
    for (let index = 0; index < fingersLengthLabel.length; index++)
    {
        const point01 = fingerArray[(index * 4) + 1]
        const point02 = fingerArray[(index * 4) + 2]
        const point03 = fingerArray[(index * 4) + 3]
        const point04 = fingerArray[(index * 4) + 4];
        const length = Math.sqrt(
            Math.pow((point01["x"] - point02["x"] - point03["x"] - (point04 == null ? 0 : point04["x"])), 2)
            +
            Math.pow((point01["y"] - point02["y"] - point03["y"] - (point04 == null ? 0 : point04["y"])), 2)
        );
        fingerLength.push(length);
    }
    return fingerLength;
}

function calculateAngle(fingerArray)
{
    let fingerAngle = [];
    // Рахуємо:
    // 0 - між великим та вказівним
    // 1 - між вказівним та середнім
    // 2 - між середнім та безимяним
    // 3 - між безимяним та мізінцем
    // чому 8 - тому-що потрібно брати по 2 точки:
    // index == 0 ; dot1 = 0 dot2 = 1;
    // index == 2 ; dot1 = 1 dot2 = 2;
    // index == 4 ; dot1 = 2 dot2 = 3;
    // index == 6 ; dot1 = 3 dot2 = 4;
    // index == 8 ; dot1 = 4 dot2 = 5;
    for (let index = 0; index < 8; index += 2)
    {
        const fingerId01 = index / 2;
        const fingerId02 = fingerId01 + 1;
        // за специфікацією кожна 4 точка (з початку + 1) - це найменша точка пальця
        // за специфікацією кожна 8 точка (з початку + 1) - це найбільша точка пальця
        // також за специфікацією великий палець має 3 точки, в той час як інші по 4 точки мають.

        const finger01minPoint = fingerArray[(fingerId01 * 4) + 1 + (fingerId01 === 0 ? 1 : 0)];
        const finger01maxPoint = (fingerId01 === 0 ? fingerArray[4] : fingerArray[(fingerId01 * 4) + 4]);

        const finger02minPoint = fingerArray[(fingerId02 * 4) + 1 + (fingerId02 === 0 ? 1 : 0)];
        const finger02maxPoint = (fingerId02 === 0 ? fingerArray[4] : fingerArray[(fingerId02 * 4) + 4]);

        const point01Xmin = finger01minPoint["x"];
        const point01Ymin = finger01minPoint["y"];
        const point02Xmin = (finger02minPoint)["x"];
        const point02Ymin = (finger02minPoint)["y"];
        const point01Xmax = finger01maxPoint["x"];
        const point01Ymax = finger01maxPoint["y"];
        const point02Xmax = (finger02maxPoint)["x"];
        const point02Ymax = (finger02maxPoint)["y"];

        const dotProduct = (point01Xmax - point01Xmin) * (point02Xmax - point02Xmin) + (point01Ymax - point01Ymin) * (point02Ymax - point02Ymin);
        const magnitude1 = Math.sqrt((point01Xmax - point01Xmin) ** 2 + (point01Ymax - point01Ymin) ** 2);
        const magnitude2 = Math.sqrt((point02Xmax - point02Xmin) ** 2 + (point02Ymax - point02Ymin) ** 2);
        const cosineTheta = dotProduct / (magnitude1 * magnitude2);
        const angleRad = Math.acos(cosineTheta);
        const angleDeg = (angleRad * 180) / Math.PI;
        fingerAngle.push(parseInt(angleDeg.toFixed(0)));
    }
    return fingerAngle;
}
