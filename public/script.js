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
let points = 0;
let level = 1;
let gameRunning = false; // Startet nur nach Klick auf "Start Race"
let obstacleSpawner; // Referenz für das Hindernis-Interval
let keys = {}; // Aktive Tasten speichern

// Punktesystem zeichnen
function drawPoints() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left"; // Text links ausrichten
  ctx.fillText(`Points: ${points}`, 20, 30); // Abstand zur linken Seite korrigiert
  ctx.fillText(`Level: ${level}`, 20, 60); // Abstand zur linken Seite korrigiert
}

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
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Hindernisse bewegen und prüfen
function updateObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += obstacleSpeed;

    // Horizontale Bewegung (optional für bewegliche Hindernisse)
    if (obstacle.moving) {
      obstacle.x += obstacle.direction;
      // Begrenzung der Bewegung
      if (
        obstacle.x < track.x ||
        obstacle.x + obstacle.width > track.x + track.width
      ) {
        obstacle.direction *= -1; // Richtung ändern
      }
    }
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
  if (!gameRunning) return;
  const obstacleWidth = Math.random() * 50 + 30; // Breite: 30-80
  const obstacleHeight = Math.random() * 30 + 20; // Höhe: 20-50
  const obstacleX = track.x + Math.random() * (track.width - obstacleWidth);
  const obstacleColor = ["blue", "green", "yellow", "purple"][
    Math.floor(Math.random() * 4)
  ]; // Zufällige Farbe

  const moving = Math.random() < 0.3; // 30% Wahrscheinlichkeit für Bewegung
  const direction = Math.random() < 0.5 ? -2 : 2; // Bewegungsrichtung (links oder rechts)

  obstacles.push({
    x: obstacleX,
    y: -50,
    width: obstacleWidth,
    height: obstacleHeight,
    color: obstacleColor,
    moving: moving,
    direction: direction,
  });
}

// Bewegung basierend auf aktiven Tasten
function moveCar() {
  if (!gameRunning) return;

  if (keys["ArrowLeft"]) car.x -= car.speed;
  if (keys["ArrowRight"]) car.x += car.speed;
  if (keys["ArrowUp"]) car.y -= car.speed;
  if (keys["ArrowDown"]) car.y += car.speed;

  // Begrenzung des Autos innerhalb der Rennstrecke
  car.x = Math.max(track.x, Math.min(track.x + track.width - car.width, car.x));
  car.y = Math.max(0, Math.min(canvas.height - car.height, car.y));
}

// Event Listener für Tasteneingaben
window.addEventListener("keydown", (event) => {
  keys[event.key] = true; // Taste gedrückt
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false; // Taste losgelassen
});

// Spiel starten
function startGame() {
  points = 0;
  level = 1;
  obstacleSpeed = 4;
  obstacles = [];
  car.x = track.x + track.width / 2 - 25;
  car.y = canvas.height - 120;
  gameRunning = true;
  obstacleSpawner = setInterval(spawnObstacle, obstacleSpawnInterval);
  gameLoop();
}

// Spiel beenden
function endGame() {
  gameRunning = false;
  clearInterval(obstacleSpawner); // Hindernis-Interval stoppen
  alert(`Game Over! You scored ${points} points.`);
  showStartScreen(); // Zurück zur Startseite
}

// Spielschleife
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrack();
  drawCar();
  drawObstacles();
  drawPoints();
  updateObstacles();
  moveCar(); // Auto bewegen

  points++;
  if (points % 500 === 0) {
    level++;
    obstacleSpeed += 1;
  }

  requestAnimationFrame(gameLoop);
}

// Startseite anzeigen
function showStartScreen() {
  gameRunning = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Press 'Start Race' to Begin!", canvas.width / 2, canvas.height / 2);

  // Vorherige Buttons entfernen
  const existingButton = document.getElementById("startButton");
  if (existingButton) existingButton.remove();

  const startButton = document.createElement("button");
  startButton.id = "startButton";
  startButton.innerText = "Start Race";
  startButton.style.position = "absolute";
  startButton.style.top = `${canvas.height / 2 + 40}px`;
  startButton.style.left = `${canvas.width / 2 - 50}px`;
  document.body.appendChild(startButton);

  startButton.addEventListener("click", () => {
    startButton.remove();
    startGame();
  });
}

// Beim Laden der Seite die Startseite anzeigen
showStartScreen();
