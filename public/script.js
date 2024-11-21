// Szene, Kamera und Renderer erstellen
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Beleuchtung hinzufügen
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Umgebungslicht
scene.add(ambientLight);

// Materialien
const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// Globale Variablen für die Strecke
let currentPosition = { x: 0, z: 0 }; // Startposition
let currentRotation = 0; // Startrotation

// Funktion zum Hinzufügen eines Streckensegments
function createTrackSegment(length, curveAngle = 0) {
  const trackWidth = 20; // Breite der Strecke
  const segmentGeometry = new THREE.PlaneGeometry(trackWidth, length);
  const segment = new THREE.Mesh(segmentGeometry, trackMaterial);
  segment.rotation.x = -Math.PI / 2; // Strecke flach legen
  segment.rotation.y = currentRotation; // Orientierung setzen

  // Berechnung der neuen Position
  const dx = Math.sin(currentRotation) * length;
  const dz = Math.cos(currentRotation) * length;

  // Segment in der Szene platzieren
  segment.position.set(
    currentPosition.x + dx / 2,
    0,
    currentPosition.z - dz / 2
  );

  scene.add(segment);

  // Debug-Markierung
  createDebugMarker(segment.position.x, segment.position.z, "yellow");

  // Position und Rotation für das nächste Segment aktualisieren
  currentPosition.x += dx;
  currentPosition.z -= dz;
  currentRotation += curveAngle;
}

// Debug-Markierungen hinzufügen
function createDebugMarker(x, z, color) {
  const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, 0.5, z);
  scene.add(marker);
}

// Strecke aufbauen
createTrackSegment(50); // Gerade
createTrackSegment(30, Math.PI / 8); // Rechtskurve
createTrackSegment(50); // Gerade
createTrackSegment(30, -Math.PI / 8); // Linkskurve
createTrackSegment(50); // Gerade

// Auto erstellen
const carGeometry = new THREE.BoxGeometry(5, 2, 10); // Breite x Höhe x Länge
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 1, 0); // Auto leicht über der Strecke platzieren
scene.add(car);

// Debug-Markierung für das Auto
createDebugMarker(0, 0, "red"); // Position des Autos

// Steuerung
let keys = {};
window.addEventListener("keydown", (event) => (keys[event.key] = true));
window.addEventListener("keyup", (event) => (keys[event.key] = false));

// Kamera positionieren
camera.position.set(0, 50, 100); // Schräg über der Szene
camera.lookAt(0, 0, -50); // Auf die Strecke schauen

// Animationsschleife
function animate() {
  requestAnimationFrame(animate);

  // Bewegung des Autos
  const speed = 0.5;
  const turnSpeed = 0.03;
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

  renderer.render(scene, camera);
}
animate();
