// Szene, Kamera und Renderer erstellen
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Beleuchtung hinzufügen
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Boden (Rennstrecke)
const trackGeometry = new THREE.PlaneGeometry(10, 100);
const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
track.rotation.x = -Math.PI / 2; // Flach legen
scene.add(track);

// Auto (eine Box)
const carGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = 0.25; // Etwas über dem Boden
scene.add(car);

// Hindernis (eine Box)
const obstacleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
obstacle.position.set(0, 0.25, -10); // Vor dem Auto platzieren
scene.add(obstacle);

// Kamera-Position
camera.position.set(0, 5, 5);
camera.lookAt(car.position);

// Steuerung
let keys = {};
window.addEventListener("keydown", (event) => (keys[event.key] = true));
window.addEventListener("keyup", (event) => (keys[event.key] = false));

// Animationsschleife
function animate() {
  requestAnimationFrame(animate);

  // Bewegung des Autos
  if (keys["ArrowLeft"]) car.position.x -= 0.1;
  if (keys["ArrowRight"]) car.position.x += 0.1;
  if (keys["ArrowUp"]) car.position.z -= 0.1;
  if (keys["ArrowDown"]) car.position.z += 0.1;

  // Kamera folgt dem Auto
  camera.position.z = car.position.z + 5;

  renderer.render(scene, camera);
}
animate();
