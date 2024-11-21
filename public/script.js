// Szene, Kamera und Renderer erstellen
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Minimap-Canvas erstellen
const minimapCanvas = document.createElement("canvas");
minimapCanvas.width = 200;
minimapCanvas.height = 200;
minimapCanvas.style.position = "absolute";
minimapCanvas.style.top = "10px";
minimapCanvas.style.left = "10px";
minimapCanvas.style.border = "2px solid white";
document.body.appendChild(minimapCanvas);
const minimapCtx = minimapCanvas.getContext("2d");

// Materialien
const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

// Strecke bauen
let currentPosition = { x: 0, z: 0 }; // Startposition
let currentRotation = 0; // Startrotation
const trackSegments = []; // Speichert alle Segmente für die Minimap

// Funktion zum Hinzufügen von Segmenten
function createTrackSegment(length, curveAngle = 0) {
  const segmentWidth = 10; // Breite der Strecke
  const segmentGeometry = new THREE.PlaneGeometry(segmentWidth, length);
  const segment = new THREE.Mesh(segmentGeometry, trackMaterial);
  segment.rotation.x = -Math.PI / 2; // Flach legen
  segment.rotation.y = currentRotation; // Orientierung anpassen

  // Position basierend auf der aktuellen Rotation und Länge berechnen
  const dx = Math.sin(currentRotation) * length;
  const dz = Math.cos(currentRotation) * length;

  segment.position.set(
    currentPosition.x + dx / 2,
    0,
    currentPosition.z - dz / 2
  );

  scene.add(segment);

  // Begrenzungswände hinzufügen
  createWall(segmentWidth, length, segment, 5); // Rechte Wand
  createWall(segmentWidth, length, segment, -5); // Linke Wand

  // Segment zur Minimap hinzufügen
  trackSegments.push({
    x: currentPosition.x,
    z: currentPosition.z,
  });

  // Position und Rotation für das nächste Segment aktualisieren
  currentPosition.x += dx;
  currentPosition.z -= dz;
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

// Minimap aktualisieren
function updateMinimap() {
  minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

  // Strecke zeichnen
  minimapCtx.strokeStyle = "white";
  minimapCtx.lineWidth = 2;
  minimapCtx.beginPath();
  let startX = minimapCanvas.width / 2;
  let startZ = minimapCanvas.height / 2;
  minimapCtx.moveTo(startX, startZ);

  for (const segment of trackSegments) {
    const x = segment.x * 0.1; // Skalierung für die Minimap
    const z = segment.z * 0.1; // Skalierung für die Minimap
    minimapCtx.lineTo(startX + x, startZ - z);
  }
  minimapCtx.stroke();

  // Auto positionieren
  const carX = minimapCanvas.width / 2 + car.position.x * 0.1;
  const carZ = minimapCanvas.height / 2 - car.position.z * 0.1;
  minimapCtx.fillStyle = "red";
  minimapCtx.beginPath();
  minimapCtx.arc(carX, carZ, 5, 0, 2 * Math.PI);
  minimapCtx.fill();
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

  // Minimap aktualisieren
  updateMinimap();

  renderer.render(scene, camera);
}
animate();
