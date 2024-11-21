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
function createTrackSegment(width, length, x, z, rotation = 0) {
  const segmentGeometry = new THREE.PlaneGeometry(width, length);
  const segment = new THREE.Mesh(segmentGeometry, trackMaterial);
  segment.rotation.x = -Math.PI / 2; // Flach legen
  segment.rotation.z = rotation; // Rotation hinzufügen
  segment.position.set(x, 0, z);
  scene.add(segment);
  return segment;
}

// Begrenzungswände
function createWall(width, height, depth, x, z) {
  const wallGeometry = new THREE.BoxGeometry(width, height, depth);
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(x, height / 2, z); // Position anpassen
  scene.add(wall);
  return wall;
}

// Strecke erstellen
createTrackSegment(10, 50, 0, 0); // Startgerade
createTrackSegment(10, 20, 5, -30, Math.PI / 8); // Rechtskurve
createTrackSegment(10, 30, 10, -60); // Gerade
createTrackSegment(10, 20, 0, -80, -Math.PI / 8); // Linkskurve
createTrackSegment(10, 40, -10, -120); // Gerade
createTrackSegment(10, 30, -20, -150, Math.PI / 8); // Rechtskurve

// Begrenzungswände entlang der Strecke
createWall(1, 1, 50, 5.5, 0); // Rechte Wand der Startgeraden
createWall(1, 1, 50, -5.5, 0); // Linke Wand der Startgeraden
createWall(1, 1, 20, 10.5, -30); // Rechte Wand der Kurve
createWall(1, 1, 20, -0.5, -30); // Linke Wand der Kurve

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
  if (keys["ArrowUp"]) car.position.z -= 0.1;
  if (keys["ArrowDown"]) car.position.z += 0.1;

  // Kamera folgt dem Auto
  camera.position.z = car.position.z + 5;
  camera.lookAt(car.position);

  renderer.render(scene, camera);
}
animate();
