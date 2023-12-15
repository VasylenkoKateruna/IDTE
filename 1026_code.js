let marker_visible={ A: false, B: false};

AFRAME.registerComponent("registerevents", 
	{
		init: function () {
			var marker = this.el;
			marker.addEventListener('markerFound', function() {
				console.log('Знайдено маркер ', marker.id); 
				marker_visible[marker.id] = true;
			});
			marker.addEventListener('markerLost', function() {
				console.log('Втрачено маркер ', marker.id); 
				marker_visible[marker.id] = false;
			});
		}
	}
);

AFRAME.registerComponent("run", 
	{
		init: function () {
			this.A = document.querySelector("a-marker#A");
			this.B = document.querySelector("a-marker#B");
			this.AB = document.querySelector("#AB").object3D;
			
			const geometry = new THREE.CylinderGeometry( 0.05, 0.05, 1, 32 ); ;
			geometry.applyMatrix4(new THREE.Matrix4().makeTranslation (0, 0.5, 0));
			geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI/2));
			const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
			this.lineAB = new THREE.Mesh( geometry, material );

			this.lineAB.visible=false;

			this.AB.add(this.lineAB);
			console.log(this.AB);
		},
		tick: function (time, deltaTime) {
			if(marker_visible["A"] && marker_visible["B"])
			{
				this.lineAB.visible=true;

				const vecA = new THREE.Vector3();
				const vecB = new THREE.Vector3();
				this.A.object3D.getWorldPosition(vecA);
				this.B.object3D.getWorldPosition(vecB);
				const vidstanAB = vecA.distanceTo(vecB);
				this.lineAB.lookAt(vecB);
				this.lineAB.scale.set(1,1,vidstanAB);
				//console.log(vecA);
				//console.log(vecB);
				console.log("AB = ",vidstanAB);
			}
			if(!marker_visible["A"] || !marker_visible["B"])
				this.lineAB.visible=false;
		}
	}
);

