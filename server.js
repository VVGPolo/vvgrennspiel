const express = require("express");
const { Server } = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, "public")));

// HTTP-Server starten
const server = app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

// WebSocket-Server einrichten
const wss = new Server({ server });

let players = [];

wss.on("connection", (ws) => {
  console.log("Neuer Spieler verbunden");
  players.push(ws);

  ws.on("message", (message) => {
    players.forEach((player) => {
      if (player !== ws) {
        player.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Spieler hat die Verbindung getrennt");
    players = players.filter((player) => player !== ws);
  });
});
