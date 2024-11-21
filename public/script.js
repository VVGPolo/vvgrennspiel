// Szene, Kamera und Renderer erstellen
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Beleuchtung hinzufügen (Umgebungslicht)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Helles Licht
scene.add(ambientLight);

// Materialien
const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// Strecke erstellen
function createTrack() {
  const trackGeometry = new THREE.PlaneGeometry(50, 200); // Breite x Länge der Strecke
  const track = new THREE.Mesh(trackGeometry, trackMaterial);
  track.rotation.x = -Math.PI / 2; // Strecke flach legen
  track.position.set(0, 0, -100); // Strecke vor der Kamera platzieren
  scene.add(track);

  // Debug-Markierungen auf der Strecke
  createDebugMarker(0, -100, "yellow"); // Mitte der Strecke
}
createTrack();

// Auto erstellen
function createCar() {
  const carGeometry = new THREE.BoxGeometry(5, 2, 10); // Breite x Höhe x Länge
  const car = new THREE.Mesh(carGeometry, carMaterial);
  car.position.set(0, 1, 0); // Auto leicht über der Strecke platzieren
  scene.add(car);

  // Debug-Markierung für das Auto
  createDebugMarker(0, 0, "red"); // Position des Autos
}
createCar();

// Debug-Markierungen hinzufügen
function createDebugMarker(x, z, color) {
  const markerGeometry = new THREE.SphereGeometry(1, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, 1, z);
  scene.add(marker);
}

// Test-Würfel (bleibt für Kontrolle)
const testCubeGeometry = new THREE.BoxGeometry(5, 5, 5);
const testCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const testCube = new THREE.Mesh(testCubeGeometry, testCubeMaterial);
testCube.position.set(20, 2.5, -50); // Außerhalb der Strecke platzieren
scene.add(testCube);

// Kamera positionieren
camera.position.set(0, 50, 50); // Schräg über der Szene
camera.lookAt(0, 0, -100); // Auf die Strecke schauen

// Animationsschleife
function animate() {
  requestAnimationFrame(animate);
  testCube.rotation.x += 0.01; // Test: Würfel drehen
  testCube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
