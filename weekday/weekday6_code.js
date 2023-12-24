let marker_visible = { A: false, B: false, C: false, D: false };

AFRAME.registerComponent("registerevents", {
    init: function () {
        var marker = this.el;
        marker.addEventListener('markerFound', function () {
            console.log('Знайдено маркер ', marker.id);
            marker_visible[marker.id] = true;
        });
        marker.addEventListener('markerLost', function () {
            console.log('Втрачено маркер ', marker.id);
            marker_visible[marker.id] = false;
        });
    }
});

AFRAME.registerComponent("run", {
    init: function () {
        this.A = document.querySelector("a-marker#A");
        this.B = document.querySelector("a-marker#B");
        this.C = document.querySelector("a-marker#C");
        this.D = document.querySelector("a-marker#D");
        this.AB = document.querySelector("#AB").object3D;
        this.BC = document.querySelector("#BC").object3D;
        this.CD = document.querySelector("#CD").object3D;
        this.DA = document.querySelector("#DA").object3D;

        const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
        geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.lineAB = new THREE.Mesh(geometry, material);
        this.lineBC = new THREE.Mesh(geometry, material);
        this.lineCD = new THREE.Mesh(geometry, material);
        this.lineDA = new THREE.Mesh(geometry, material);

        this.lineAB.visible = false;
        this.lineBC.visible = false;
        this.lineCD.visible = false;
        this.lineDA.visible = false;

        this.AB.add(this.lineAB);
        console.log(this.AB);

        this.BC.add(this.lineBC);
        console.log(this.BC);

        this.CD.add(this.lineCD);
        console.log(this.CD);

        this.DA.add(this.lineDA);
        console.log(this.DA);
    },
    tick: function (time, deltaTime) {
        if (marker_visible["A"] && marker_visible["B"] && marker_visible["C"] && marker_visible["D"]) {
            this.lineAB.visible = true;
            this.lineBC.visible = true;
            this.lineCD.visible = true;
            this.lineDA.visible = true;

            const vecA = new THREE.Vector3();
            const vecB = new THREE.Vector3();
            const vecC = new THREE.Vector3();
            const vecD = new THREE.Vector3();

            this.A.object3D.getWorldPosition(vecA);
            this.B.object3D.getWorldPosition(vecB);
            this.C.object3D.getWorldPosition(vecC);
            this.D.object3D.getWorldPosition(vecD);
            const vidstanAB = vecA.distanceTo(vecB);
            const vidstanBC = vecB.distanceTo(vecC);
            const vidstanCD = vecC.distanceTo(vecD);
            const vidstanDA = vecD.distanceTo(vecA);
            this.lineAB.lookAt(vecB);
            this.lineAB.scale.set(1, 1, vidstanAB);

            this.lineBC.lookAt(vecC);
            this.lineBC.scale.set(1, 1, vidstanBC);

            this.lineCD.lookAt(vecD);
            this.lineCD.scale.set(1, 1, vidstanCD);

            this.lineDA.lookAt(vecA);
            this.lineDA.scale.set(1, 1, vidstanDA);

            console.log("AB = ", vidstanAB);
            console.log("BC = ", vidstanBC);
            console.log("CD = ", vidstanCD);
            console.log("DA = ", vidstanDA);

            // Отримайте масив активних маркерів
            const activeMarkers = Object.keys(marker_visible).filter(marker => marker_visible[marker]);

            // Кількість активних маркерів
            const numActiveMarkers = activeMarkers.length;

            // Кількість можливих трикутників
            const numPossibleTriangles = numActiveMarkers >= 3 ? factorial(numActiveMarkers) / (factorial(3) * factorial(numActiveMarkers - 3)) : 0;

            console.log(`Кількість активних маркерів: ${numActiveMarkers}`);
            console.log(`Кількість можливих трикутників: ${numPossibleTriangles}`);

            // Обчислити площу та периметр для кожного можливого трикутника
            for (let i = 0; i < activeMarkers.length - 2; i++) {
                for (let j = i + 1; j < activeMarkers.length - 1; j++) {
                    for (let k = j + 1; k < activeMarkers.length; k++) {
                        const marker1 = activeMarkers[i];
                        const marker2 = activeMarkers[j];
                        const marker3 = activeMarkers[k];

                        const vec1 = new THREE.Vector3();
                        const vec2 = new THREE.Vector3();
                        const vec3 = new THREE.Vector3();

                        this[marker1].object3D.getWorldPosition(vec1);
                        this[marker2].object3D.getWorldPosition(vec2);
                        this[marker3].object3D.getWorldPosition(vec3);

                        const side1 = vec1.distanceTo(vec2);
                        const side2 = vec2.distanceTo(vec3);
                        const side3 = vec3.distanceTo(vec1);

                        // Периметр трикутника
                        const perimeter = side1 + side2 + side3;

                        // Половина периметру для обчислення площі трикутника за формулою Герона
                        const semiPerimeter = perimeter / 2;

                        // Площа трикутника за формулою Герона
                        const area = Math.sqrt(semiPerimeter * (semiPerimeter - side1) * (semiPerimeter - side2) * (semiPerimeter - side3));

                        console.log(`Трикутник ${marker1}-${marker2}-${marker3}:`);
                        console.log(`Периметр: ${perimeter}`);
                        console.log(`Площа: ${area}`);
                    }
                }
            }
        } else {
            this.lineAB.visible = false;
            this.lineBC.visible = false;
            this.lineCD.visible = false;
            this.lineDA.visible = false;
        }
    }
});

// Функція для обчислення факторіалу
function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
