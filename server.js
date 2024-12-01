// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://arena-play.vercel.app/", 
//     methods: ["GET", "POST"],
//     transports: ['websocket', 'polling'], 
//   },
// });

// app.use(
//   cors({
//     origin: "https://arena-play.vercel.app/",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

// const players = {};
// const FINISH_LINE = 700;

// // Socket.IO logic
// io.on("connection", (socket) => {
//   console.log("A player connected:", socket.id);

//   players[socket.id] = { x: 0, y: 0, color: getRandomColor() };
//   socket.emit("init", players);
//   socket.broadcast.emit("new-player", { id: socket.id, car: players[socket.id] });

//   socket.on("car-move", (data) => {
//     if (players[socket.id]) {
//       players[socket.id].x = data.x;
//       players[socket.id].y = data.y;
//       io.emit("car-update", { id: socket.id, car: players[socket.id] });
//       if (players[socket.id].x >= FINISH_LINE) {
//         io.emit("winner", socket.id);
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("A player disconnected:", socket.id);
//     delete players[socket.id];
//     io.emit("player-disconnect", socket.id);
//   });
// });

// // Utility function
// function getRandomColor() {
//   const colors = ["red", "blue", "green", "yellow"];
//   return colors[Math.floor(Math.random() * colors.length)];
// }

// // Basic route
// app.get("/", (req, res) => {
//   res.send("home");
// });

// // Conditional `server.listen`
//   const PORT = process.env.PORT || 8080;
//   server.listen(PORT, () => {
//     console.log(`Server is listening on http://localhost:${PORT}`);
//   });
// module.exports = server;

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const corsConfig = require("./Config/cors");
const gameController = require("./Controllers/gameController");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsConfig,
});

app.use(cors(corsConfig));
app.use("/", require("./Routes"));

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);
  gameController(io, socket);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = server;
