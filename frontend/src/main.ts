import * as THREE from "three";

import TWEEN from "@tweenjs/tween.js";
import { Settlement } from "./settlement/settlement";
import { WorldPlane } from "./world/world";
import { Actor } from "./actor/actor";
import stars from "./assets/images/stars.png";
import Stats from "three/examples/jsm/libs/stats.module";
import { GetMarkets, GetMarket } from "../wailsjs/go/main/App";

const stats = new Stats();
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const sphereGeometry = new THREE.SphereGeometry(25, 50, 50);
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(stars),
  side: THREE.BackSide, // Render the sphere on the inside to make it a skybox
});
const starrySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(starrySphere);

// Set the initial camera position
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1920, 1080);
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement)
const light = new THREE.AmbientLight(0xffffff, 2);
light.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(light);
// create World
const world = new WorldPlane(scene);

// create player
const actor = new Actor(scene, "player", 100, new THREE.Vector3(0, 0.5, 0));
console.log(actor.getMesh().position);

const settlements: Settlement[] = [];
//create settlements from server
GetMarkets().then((resp) => {
  for (let settlement of resp) {
    // Generate random coordinates within a 10x10 area
    const randomX = Math.random() * 10 - 5; // Random x coordinate between -5 and 5
    const randomZ = Math.random() * 10 - 5; // Random z coordinate between -5 and 5

    settlements.push(
      new Settlement(
        scene,
        new THREE.Vector3(randomX, 0, randomZ),
        settlement.marketName,
        100
      )
    );
  }
});

const points = new Array();
points.push(new THREE.Vector3(0, 0, 0));
points.push(new THREE.Vector3(0, 3, 0));
const material1 = new THREE.LineBasicMaterial({ color: 0x01ff00 });
const geometry1 = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry1, material1);
scene.add(line);

// Set up raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse click
document.addEventListener("mousedown", onMouseClick, false);
let currentTween = new TWEEN.Tween(new THREE.Vector3());
function onMouseClick(event: { clientX: number; clientY: number }) {
  // Calculate mouse position
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Set up the raycaster
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(world.getMesh());
  if (intersects.length > 0) {
    line.position.set(0, 0, 0);
    line.lookAt((intersects[0].face as THREE.Face).normal);
    line.position.copy(intersects[0].point);
    const intersectionPoint = intersects[0].point;
    currentTween.stop();
    currentTween = actor.move(intersectionPoint);
  }
}

function animate() {
  requestAnimationFrame(animate);
  starrySphere.rotateX(0.00025);
  TWEEN.update();
  checkCollisions();
  actor.mixer.update(0.01);
  const { x, y, z } = actor.getMesh().position;
  starrySphere.position.set(x, y, z);
  updateCamera();
  stats.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
const collisionCheckTimer = setInterval(checkCollisions, 333);
console.log(collisionCheckTimer);
let currentSettlement = "";
function checkCollisions() {
  const actorBoundingSphere = new THREE.Sphere(actor.getMesh().position, 1.5);
  settlements.map((settlement, i) => {
    // console.log('checking', settlementBoundingSphere)
    const distance = actorBoundingSphere.center.distanceTo(
      settlement.getboundingSphere().center
    );
    const collisionDistance =
      actorBoundingSphere.radius + settlement.getboundingSphere().radius;

    if (distance <= collisionDistance) {
      if (currentSettlement === settlement.getName()) {
        return;
      }
      actor.mixer.stopAllAction();
      actor.standIdle();
      GetMarket(i).then((resp) => {
        console.log(resp);
      });
      currentSettlement = settlement.getName();
      TWEEN.remove(currentTween);
    }
  });
}
animate();

function updateCamera() {
  // Calculate the position that the camera should be based on the actor's position
  const cameraPosition = actor.getMesh().position.clone();
  cameraPosition.add(new THREE.Vector3(0, 3, 5)); // Offset the camera position

  // Update the camera's position
  camera.position.copy(cameraPosition);

  // Make the camera look at the actor
  camera.lookAt(actor.getMesh().position);
}
