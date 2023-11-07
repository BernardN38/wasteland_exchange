import * as THREE from "three";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import TWEEN, { Tween } from "@tweenjs/tween.js";
// import actor from "../assets/images/character.fbx";
import actor1 from "../assets/images/character1.glb";
import walking from "../assets/images/character@walking.glb";
import standingGreeting from "../assets/images/character@standingGreeting.glb";
// import standingIdle from "../assets/images/StandingIdle.fbx";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import cart from "../assets/images/cart.fbx";
// import wood from "../assets/images/wood.jpg";

export class Actor {
  private name: string;
  private health: number;
  private speed: number;
  public position: THREE.Vector3;
  private mesh: THREE.Object3D; // Remove the undefined type
  private cartMesh: THREE.Object3D; // Remove the undefined type
  public mixer: THREE.AnimationMixer;
  private walkingAnimation: THREE.AnimationAction;
  private standingAnimation: THREE.AnimationAction;
  private actions: THREE.AnimationAction[];

  constructor(
    scene: THREE.Scene,
    name: string,
    initialHealth: number,
    initialPosition: THREE.Vector3
  ) {
    this.name = name;
    this.health = initialHealth;
    this.position = initialPosition;
    this.speed = 250;
    this.actions = [];
    this.mesh = new THREE.Object3D(); // Initialize as an empty object
    this.cartMesh = new THREE.Object3D(); // Initialize as an empty object
    this.mixer = new THREE.AnimationMixer(this.mesh); // Initialize with an empty mixer
    this.walkingAnimation = this.mixer.clipAction(
      new THREE.AnimationClip("walking", 1, [])
    ); // Initialize with an empty animation action
    this.standingAnimation = this.mixer.clipAction(
      new THREE.AnimationClip("standing", 1, [])
    ); // Initialize with an empty animation action
    let mixer: THREE.AnimationMixer;
    let object = new THREE.Object3D();
    const animationActions: THREE.AnimationAction[] = [];

    const gltfLoader = new GLTFLoader();
    this.actions = animationActions;
    gltfLoader.load(
      actor1,
      (char) => {
        mixer = new THREE.AnimationMixer(char.scene);
        scene.add(char.scene);
        char.scene.scale.set(0.5, 0.5, 0.5);
        this.mesh = char.scene;
        gltfLoader.load(
          walking,
          (gltf) => {
            console.log("loaded walking", gltf.animations[0]);
            const animationAction = mixer.clipAction(gltf.animations[0]);

            animationActions.push(animationAction);
            this.walkingAnimation = animationAction;
            gltfLoader.load(
              standingGreeting,
              (gltf) => {
                console.log("loaded standing greeting", gltf.animations[0]);
                const animationAction = mixer.clipAction(gltf.animations[0]);

                animationActions.push(animationAction);
                this.standingAnimation = animationAction;
              },
              (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.log(error);
          }
        );
        this.mixer = mixer;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
    this.mesh = object;
    this.mesh.position.set(
      initialPosition.x,
      initialPosition.y,
      initialPosition.z
    );
    // this.mesh.scale.set(0.1, 0.1, 0.1);
    console.log(this.actions);
  }
  // Method to move to a new position
  move(intersectionPoint: THREE.Vector3): Tween<THREE.Vector3> {
    this.walkingAnimation.play();
    this.mesh.lookAt(intersectionPoint);
    const distance = Math.sqrt(
      Math.pow(intersectionPoint.x - this.getMesh().position.x, 2) +
        Math.pow(intersectionPoint.z - this.getMesh().position.z, 2)
    );

    // Calculate the time based on the speed
    const travelTime = (distance * 300000) / this.speed;
    return (
      new TWEEN.Tween(this.getMesh().position)
        .to({ x: intersectionPoint.x, z: intersectionPoint.z }, travelTime)
        // Adjust the easing function if needed
        // .easing(...)
        .start()
    );
  }
  // Getters for name, health, position, and mesh
  standIdle() {
    this.standingAnimation.play();
  }
  getCartMesh(): THREE.Object3D {
    return this.cartMesh as THREE.Object3D;
  }
  getName(): string {
    return this.name;
  }

  getHealth(): number {
    return this.health;
  }

  getPosition(): { x: number; y: number; z: number } {
    return this.position;
  }

  getMesh(): THREE.Mesh {
    return this.mesh as THREE.Mesh;
  }
}
