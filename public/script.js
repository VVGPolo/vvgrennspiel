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

// Materialien
const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

// Strecke bauen
let lastPosition = { x: 0, z: 0 }; // Startposition
let lastRotation = 0; // Startrotation

// Funktion zum Hinzufügen von Segmenten
function createTrackSegment(length, curveAngle = 0) {
  const segmentWidth = 10; // Breite der Strecke
  const segmentGeometry = new THREE.PlaneGeometry(segmentWidth, length);
  const segment = new THREE.Mesh(segmentGeometry, trackMaterial);
  segment.rotation.x = -Math.PI / 2; // Flach legen
  segment.rotation.y = lastRotation; // Orientierung anpassen

  // Position basierend auf der vorherigen Position und Rotation berechnen
  const dx = Math.sin(lastRotation) * length / 2;
  const dz = Math.cos(lastRotation) * length / 2;
  lastPosition.x += dx;
  lastPosition.z -= dz;

  segment.position.set(lastPosition.x, 0, lastPosition.z);

  // Begrenzungswände hinzufügen
  createWall(segmentWidth, length, segment, 5); // Rechte Wand
  createWall(segmentWidth, length, segment, -5); // Linke Wand

  // Rotation und Position für das nächste Segment aktualisieren
  lastRotation += curveAngle;
  lastPosition.x += Math.sin(lastRotation) * length / 2;
  lastPosition.z -= Math.cos(lastRotation) * length / 2;

  scene.add(segment);
  return segment;
}

// Begrenzungswände entlang der Strecke
function createWall(segmentWidth, segmentLength, segment, offsetX) {
  const wallGeometry = new THREE.BoxGeometry(1, 2, segmentLength);
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);

  // Position basierend auf der Rotation und dem Offset berechnen
  const dx = Math.cos(segment.rotation.y) * offsetX;
  const dz = Math.sin(segment.rotation.y) * offsetX;
  wall.position.set(segment.position.x + dx, 1, segment.position.z - dz);

  wall.rotation.y = segment.rotation.y;
  scene.add(wall);
}

// Strecke erstellen
createTrackSegment(50); // Gerade
createTrackSegment(20, Math.PI / 8); // Rechtskurve
createTrackSegment(30); // Gerade
createTrackSegment(20, -Math.PI / 8); // Linkskurve
createTrackSegment(40); // Gerade
createTrackSegment(30, Math.PI / 8); // Rechtskurve
createTrackSegment(50); // Gerade

// Auto
const carGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = 0.25; // Etwas über dem Boden
scene.add(car);

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
  if (keys["ArrowUp"]) {
    car.position.z -= 0.1 * Math.cos(lastRotation);
    car.position.x -= 0.1 * Math.sin(lastRotation);
  }
  if (keys["ArrowDown"]) {
    car.position.z += 0.1 * Math.cos(lastRotation);
    car.position.x += 0.1 * Math.sin(lastRotation);
  }

  // Kamera folgt dem Auto
  camera.position.z = car.position.z + 5;
  camera.position.x = car.position.x;
  camera.lookAt(car.position);

  renderer.render(scene, camera);
}
animate();
