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
