const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let car = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 100,
  color: "red",
  speed: 5,
};

// Zeichnet das Auto
function drawCar() {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Bewegt das Auto
function moveCar(event) {
  if (event.key === "ArrowLeft") car.x -= car.speed;
  if (event.key === "ArrowRight") car.x += car.speed;
  if (event.key === "ArrowUp") car.y -= car.speed;
  if (event.key === "ArrowDown") car.y += car.speed;

  // Begrenzung des Autos im Canvas
  car.x = Math.max(0, Math.min(canvas.width - car.width, car.x));
  car.y = Math.max(0, Math.min(canvas.height - car.height, car.y));
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", moveCar);
gameLoop();
