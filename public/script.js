// Canvas und Kontext
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Rennstrecke und Auto-Objekt
let track = {
  width: canvas.width / 3,
  x: canvas.width / 3,
  color: "#666",
};
let car = {
  x: track.x + track.width / 2 - 25,
  y: canvas.height - 120,
  width: 50,
  height: 100,
  color: "red",
  speed: 5,
};

// Hindernisse
let obstacles = [];
let obstacleSpeed = 4;
let obstacleSpawnInterval = 2000;

// Auto zeichnen
function drawCar() {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Rennstrecke zeichnen
function drawTrack() {
  ctx.fillStyle = track.color;
  ctx.fillRect(track.x, 0, track.width, canvas.height);
}

// Hindernisse zeichnen
function drawObstacles() {
  ctx.fillStyle = "blue";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Hindernisse bewegen und prüfen
function updateObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += obstacleSpeed;
  });
  // Entferne Hindernisse, die aus dem Bildschirm sind
  obstacles = obstacles.filter((obstacle) => obstacle.y < canvas.height);

  // Kollisionsprüfung
  obstacles.forEach((obstacle) => {
    if (
      car.x < obstacle.x + obstacle.width &&
      car.x + car.width > obstacle.x &&
      car.y < obstacle.y + obstacle.height &&
      car.y + car.height > obstacle.y
    ) {
      alert("Game Over!");
      window.location.reload();
    }
  });
}

// Hindernisse zufällig erstellen
function spawnObstacle() {
  const obstacleWidth = Math.random() * 40 + 30;
  const obstacleX = track.x + Math.random() * (track.width - obstacleWidth);
  obstacles.push({ x: obstacleX, y: -50, width: obstacleWidth, height: 20 });
}

// Auto bewegen
function moveCar(event) {
  if (event.key === "ArrowLeft") car.x -= car.speed;
  if (event.key === "ArrowRight") car.x += car.speed;
  if (event.key === "ArrowUp") car.y -= car.speed;
  if (event.key === "ArrowDown") car.y += car.speed;

  // Begrenzung des Autos innerhalb der Rennstrecke
  car.x = Math.max(track.x, Math.min(track.x + track.width - car.width, car.x));
  car.y = Math.max(0, Math.min(canvas.height - car.height, car.y));
}

// Spielschleife
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrack();
  drawCar();
  drawObstacles();

  updateObstacles();

  requestAnimationFrame(gameLoop);
}

// Hindernisse alle 2 Sekunden hinzufügen
setInterval(spawnObstacle, obstacleSpawnInterval);

// Event Listener und Start der Spielschleife
window.addEventListener("keydown", moveCar);
gameLoop();
