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
/*
  TODO:
    [] Use math.combinations(n, k) for binomial coefficient
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
        const myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        this.sphere.material = myMaterial;
        this.position.y = 0.0;
        this.sphere.scaling = new BABYLON.Vector3(2.0, 2.0, 2.0);

        const equator = this.createEquator();
        equator.parent = this.sphere;
        equator.color = this.latLineColor;

        myMaterial.alpha = 0.4;

        this.updateAppearanceWithStateVector(this.quantumStateVector);
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

    updateAppearanceWithStateVector(stateVector) {
        console.log("stateVector: " + stateVector);
        let numStates = stateVector.size();
        let numBits = Math.log2(numStates);
        let loc = math.max(math.abs(stateVector));
        console.log("loc: " + loc);

        // Remove the global phase TODO: Implement
        // let angles = (np.angle(state_vec[loc]) + 2 * Math.PI) % (2 * Math.PI)
        // angleset = np.exp(-1j*angles)
        // print(state_vec)
        // # print(angles)
        // state_vec = angleset*state_vec
        // print(state_vec)
        // state_vec.flatten()

        console.log("numStates: " + numStates);
        for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
            console.log("stateIndex: " + stateIndex +
                ", math.subset(stateVector, math.index(stateIndex)): " + math.subset(stateVector, math.index(stateIndex)));
            let weight = Hamming.calcWeight(stateIndex);
            let zCoord = -2 * weight / numBits + 1;
            console.log("numBits: " + numBits + ", weight: " + weight);
            // let numDivisions = math.combinations(numBits, weight);
            let numDivisions = math.combinations(numBits, weight);
            let weightOrder = Hamming.weightIndex(stateIndex, numBits);
            let angle = weightOrder * 2 * Math.PI / numDivisions;
            let xCoord = math.sqrt(1 - math.pow(zCoord, 2)) * math.cos(angle);
            let yCoord = math.sqrt(1 - math.pow(zCoord, 2)) * math.sin(angle);
            console.log("xCoord: " + xCoord + ", yCoord: " + yCoord + ", zCoord: " + zCoord);
            let amplitude = math.subset(stateVector, math.index(stateIndex));
            let probability = amplitude * math.conj(amplitude);
            console.log("amplitude: " + amplitude + ", probability: " + probability);

            const lineEndpoint = new BABYLON.Vector3(yCoord, zCoord, -xCoord);
            const basisStatePoints = [
                this.sphere.position,
                lineEndpoint
            ];
            const basisStateLine = BABYLON.MeshBuilder.CreateLines("basisStatePoints",
                {points: basisStatePoints}, this.scene);
            basisStateLine.color = Qutil.calcColorForPhase(amplitude);
            basisStateLine.isPickable = false;
            basisStateLine.parent = this.sphere;

            const basisStateLineCap = BABYLON.MeshBuilder.CreateSphere("quantumStateLineCap",
                {diameterX: this.radius * 0.03, diameterY: this.radius * 0.03, diameterZ: this.radius * 0.03}, this.scene);
            basisStateLineCap.color = Qutil.calcColorForPhase(amplitude);
            basisStateLine.isPickable = false;
            basisStateLineCap.parent = this.sphere;
            basisStateLineCap.position = lineEndpoint;

            const mat = new BABYLON.StandardMaterial("mat", this.scene);
            mat.diffuseColor = Qutil.calcColorForPhase(amplitude);
            basisStateLineCap.material = mat;
        }

    }
}
