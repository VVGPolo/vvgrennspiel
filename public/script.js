// Szene, Kamera und Renderer erstellen
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Beleuchtung hinzufügen (Umgebungslicht)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Helles Licht
scene.add(ambientLight);

// Test-Würfel hinzufügen
const testCubeGeometry = new THREE.BoxGeometry(5, 5, 5);
const testCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const testCube = new THREE.Mesh(testCubeGeometry, testCubeMaterial);
testCube.position.set(0, 2.5, 0); // In der Mitte der Szene platzieren
scene.add(testCube);

// Debug-Markierungen hinzufügen
function createDebugMarker(x, z, color) {
  const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, 0.5, z);
  scene.add(marker);
}
createDebugMarker(0, 0, "red"); // Debug-Marker bei (0,0)

// Kamera positionieren
camera.position.set(0, 10, 20); // Schräg über der Szene
camera.lookAt(0, 0, 0); // Auf die Szene schauen

// Animationsschleife
function animate() {
  requestAnimationFrame(animate);
  testCube.rotation.x += 0.01; // Test: Würfel drehen
  testCube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
