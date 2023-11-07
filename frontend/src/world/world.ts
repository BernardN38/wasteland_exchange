import * as THREE from "three";
import { TextureLoader } from "three";
import desertPlane from "../assets/images/desert_plane.png";
console.log(desertPlane);
export class WorldPlane {
  private scene: THREE.Scene;
  private mesh: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // Create a plane for the world
    const planeGeometry = new THREE.PlaneGeometry(50, 50);

    // Load the texture
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(desertPlane);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: texture, // Apply the loaded texture to the material
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.mesh.rotation.x = -Math.PI / 2; // Rotate the plane to be flat on the ground

    // Add the plane to the scene
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
  // Method to set the position of the world plane
  setPosition(position: THREE.Vector3): void {
    this.mesh.position.copy(position);
  }
  getMesh(): THREE.Mesh {
    return this.mesh;
  }
  // Method to remove the world plane from the scene
  remove(): void {
    this.scene.remove(this.mesh);
  }
}
