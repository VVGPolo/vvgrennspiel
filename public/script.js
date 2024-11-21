const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

let obstacles = [];
let obstacleSpeed = 4;
let obstacleSpawnInterval = 2000;
let gameRunning = true; // Spielzustand

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
      endGame();
    }
  });
}

// Hindernisse zufällig erstellen
function spawnObstacle() {
  if (!gameRunning) return; // Keine neuen Hindernisse bei "Game Over"
  const obstacleWidth = Math.random() * 40 + 30;
  const obstacleX = track.x + Math.random() * (track.width - obstacleWidth);
  obstacles.push({ x: obstacleX, y: -50, width: obstacleWidth, height: 20 });
}

// Auto bewegen
function moveCar(event) {
  if (!gameRunning) return; // Keine Bewegung bei "Game Over"
  if (event.key === "ArrowLeft") car.x -= car.speed;
  if (event.key === "ArrowRight") car.x += car.speed;
  if (event.key === "ArrowUp") car.y -= car.speed;
  if (event.key === "ArrowDown") car.y += car.speed;

  // Begrenzung des Autos innerhalb der Rennstrecke
  car.x = Math.max(track.x, Math.min(track.x + track.width - car.width, car.x));
  car.y = Math.max(0, Math.min(canvas.height - car.height, car.y));
}

// Spiel beenden
function endGame() {
  gameRunning = false;
  alert("Game Over!");
  resetGame();
}

// Spiel zurücksetzen
function resetGame() {
  obstacles = [];
  car.x = track.x + track.width / 2 - 25;
  car.y = canvas.height - 120;
  gameRunning = true;
}

// Spielschleife
function gameLoop() {
  if (!gameRunning) return; // Spiel pausieren, wenn es nicht läuft

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
