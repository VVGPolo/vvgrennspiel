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
let currentPosition = { x: 0, z: 0 }; // Startposition
let currentRotation = 0; // Startrotation

// Funktion zum Hinzufügen von Segmenten
function createTrackSegment(length, curveAngle = 0) {
  const segmentWidth = 10; // Breite der Strecke
  const segmentGeometry = new THREE.PlaneGeometry(segmentWidth, length);
  const segment = new THREE.Mesh(segmentGeometry, trackMaterial);
  segment.rotation.x = -Math.PI / 2; // Flach legen
  segment.rotation.y = currentRotation; // Orientierung anpassen

  // Position basierend auf der vorherigen Position und Rotation berechnen
  const dx = Math.sin(currentRotation) * length;
  const dz = Math.cos(currentRotation) * length;

  currentPosition.x += dx;
  currentPosition.z -= dz;

  segment.position.set(currentPosition.x - dx / 2, 0, currentPosition.z + dz / 2);

  scene.add(segment);

  // Begrenzungswände hinzufügen
  createWall(segmentWidth, length, segment, 5); // Rechte Wand
  createWall(segmentWidth, length, segment, -5); // Linke Wand

  // Debug-Markierungen (optional)
  createDebugMarker(currentPosition.x, currentPosition.z, "red");

  // Rotation für das nächste Segment aktualisieren
  currentRotation += curveAngle;
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

// Debug-Markierungen hinzufügen (zum Testen der Positionierung)
function createDebugMarker(x, z, color) {
  const markerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, 0.5, z);
  scene.add(marker);
}

// Strecke erstellen
createTrackSegment(50); // Gerade
createTrackSegment(30, Math.PI / 8); // Rechtskurve
createTrackSegment(50); // Gerade
createTrackSegment(30, -Math.PI / 8); // Linkskurve
createTrackSegment(50); // Gerade
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
  const speed = 0.2;
  const turnSpeed = 0.05;
  if (keys["ArrowLeft"]) car.rotation.y += turnSpeed;
  if (keys["ArrowRight"]) car.rotation.y -= turnSpeed;

  if (keys["ArrowUp"]) {
    car.position.x -= Math.sin(car.rotation.y) * speed;
    car.position.z -= Math.cos(car.rotation.y) * speed;
  }
  if (keys["ArrowDown"]) {
    car.position.x += Math.sin(car.rotation.y) * speed;
    car.position.z += Math.cos(car.rotation.y) * speed;
  }

  // Kamera folgt dem Auto
  camera.position.set(car.position.x, car.position.y + 5, car.position.z + 10);
  camera.lookAt(car.position);

  renderer.render(scene, camera);
}
animate();
