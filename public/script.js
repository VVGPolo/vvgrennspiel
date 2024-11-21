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
  if (!gameRunning) return; // Kei
