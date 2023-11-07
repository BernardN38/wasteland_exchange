import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import house from "../assets/images/house.fbx";
import baseColor from "../assets/images/HOUSE1_BaseColor.png";
export class Settlement {
  private scene: THREE.Scene;
  private position: THREE.Vector3;
  private name: string;
  private population: number;
  private mesh: THREE.Object3D | undefined; // Use Object3D for the mesh
  private map: THREE.Mesh | null;
  private boundingSphere: THREE.Sphere;

  constructor(
    scene: THREE.Scene,
    position: THREE.Vector3,
    name: string,
    population: number
  ) {
    this.scene = scene;
    this.position = position; // The 3D position of the settlement
    this.name = name; // Name of the settlement
    this.population = population; // Population of the settlement
    this.boundingSphere = new THREE.Sphere();
    // Load the FBX model
    const loader = new FBXLoader();
    loader.load(house, (fbx) => {
      this.mesh = fbx;
      // Scale the mesh down
      const scale = 0.006; // You can adjust this value as needed
      this.mesh.scale.set(scale, scale, scale);
      this.mesh.position.copy(this.position);
      // Load and apply the texture
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(baseColor); // Replace 'your_texture_image.jpg' with your texture image URL

      const material = new THREE.MeshStandardMaterial({ map: texture });
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      this.getMesh()?.rotateY(1);
      this.boundingSphere = new THREE.Sphere(this.getMesh()?.position, 0.3);
      this.scene.add(this.mesh);
    });

    this.map = null; // Initialize the map as null
  }
  getboundingSphere(): THREE.Sphere {
    return this.boundingSphere;
  }
  getMesh(): THREE.Object3D | undefined {
    return this.mesh;
  }

  getName(): string {
    return this.name;
  }

  // Method to update the settlement's population
  updatePopulation(newPopulation: number): void {
    this.population = newPopulation;
    // You can update the visual representation or perform other actions based on the new population.
  }

  getPopulation(): number {
    return this.population;
  }

  // Method to show the map when a player enters the settlement
  showMap(mapTexture: THREE.Texture): void {
    if (!this.map) {
      const imageTexture = new THREE.TextureLoader().load("./map.png");
      const imagePlaneGeometry = new THREE.PlaneGeometry(); // Adjust the size as needed
      const imagePlaneMaterial = new THREE.MeshBasicMaterial({
        map: imageTexture,
        transparent: true,
        opacity: 1,
      });
      const imagePlane = new THREE.Mesh(imagePlaneGeometry, imagePlaneMaterial);
      imagePlane.position.set(0, 0, 0); // Move it back along the Z-axis to be in front of other objects
      imagePlane.material.map = mapTexture;
      this.scene.add(imagePlane);
      this.map = imagePlane;
    }
  }

  // Method to remove the map
  removeMap(): void {
    if (this.map) {
      this.scene.remove(this.map);
      this.map = null;
    }
  }

  // Method to remove the settlement from the scene
  // remove(): void {
  //     this.removeMap() // Remove the map if it exists
  //     this.scene.remove(this.mesh)
  // }
}
