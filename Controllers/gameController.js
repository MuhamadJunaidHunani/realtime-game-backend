const { getRandomColor } = require("../Utils/colorUtil");

const players = {}; // All players in all rooms
const rooms = {}; // Tracks players in each room
const FINISH_LINE = 3000;

module.exports = (io, socket) => {
  socket.on("join-room", ( {roomId, player}) => {
    console.log(roomId , player , socket.id, "🫙📟");
   
    if(!roomId || !player){
        return;
    }
    
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    for (let i = rooms[roomId].length - 1; i >= 0; i--) {
      if (rooms[roomId][i] === null) {
        rooms[roomId].splice(i, 1);
      }
    }

    // Ensure only two players per room
    if (rooms[roomId].length >= 2) {
      socket.emit("room-full", roomId);
      return;
    }

    const playerData = {
      id: socket.id,
      x: 0,
      y: 0,
      color: getRandomColor(),
      name: player?.name,
      playerId: player?.uid,
      email: player?.email,
    };
    console.log(socket.id , "ppppppp");
    players[socket.id] = playerData;
    rooms[roomId].push(socket.id);
    socket.join(roomId);

    // Notify the room about the new player
    io.to(roomId).emit("player-joined", {
      players: rooms[roomId].map((id) => players[id]),
    });
    console.log(`Player ${socket.id} joined room: ${roomId}`);
  });

  socket.on("car-move", ({ roomId: roomIde, distance , x, y }) => {
    
    if (players[socket.id]) {
      players[socket.id].x = x;
      players[socket.id].y = y;

      // Broadcast movement to other players in the room
      io.to(roomIde).emit("car-update", {
        id: socket.id,
        distance:distance,
        car: players[socket.id],
      });

      // Check for winner
      if (distance >= FINISH_LINE) {
        io.to(roomIde).emit("winner", socket.id);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);

    // Remove player from all rooms and notify others
    Object.keys(rooms).forEach((roomId) => {
      const index = rooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        rooms[roomId].splice(index, 1);
        io.to(roomId).emit("player-disconnect", socket.id);
      }
    });

    delete players[socket.id];
  });   
};
