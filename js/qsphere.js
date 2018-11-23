/*
 * Copyright 2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class QSphere extends BABYLON.Mesh {
    constructor(name, scene, quantumStateVector) {
        super(name, scene);
        this.quantumStateVector = quantumStateVector;
        this.radius = 1;
        this.scene = scene; 99
        this.sphere = BABYLON.MeshBuilder.CreateSphere("qsphere", {
            diameterX: this.radius * 2,
            diameterY: this.radius * 2,
            diameterZ: this.radius * 2},
            scene);
        this.latLineColor = new BABYLON.Color3(.3, .3, .3);
        this.setupSphere();
    }

    /// Methods to construct the 3D QSphere
    setupSphere() {
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        this.sphere.material = myMaterial;
        this.position.y = 0.0;
        this.sphere.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0);

        const equator = this.createEquator();
        equator.parent = this.sphere;
        equator.color = this.latLineColor;

        myMaterial.alpha = 0.4;

    }

    createEquator() {
        const myPoints = [];
        const deltaTheta = Math.PI / 20;
        let theta = 0;
        const y = 0;
        for (let i = 0; i<Math.PI * 20; i++) {
            myPoints.push(new BABYLON.Vector3(this.radius * Math.cos(theta), y, this.radius * Math.sin(theta)));
            theta += deltaTheta;
        }

        //Create lines
        const lines = BABYLON.MeshBuilder.CreateDashedLines("lines", {points: myPoints, updatable: true}, this.scene);
        lines.isPickable = false;
        return lines;
    }

}
