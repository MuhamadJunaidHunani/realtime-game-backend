const { assignNumber } = require("../Utils/colorUtil");

const players = {}; 
const rooms = {}; 
const FINISH_LINE = 60;

module.exports = (io, socket) => {
  socket.on("join-room", ( {roomId, player}) => {
   
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

    
    if (rooms[roomId].length >= 2) {
      socket.emit("room-full", roomId);
      return;
    }

    const playerData = {
      id: socket.id,
      x: 0,
      y: 0,
      playerNumber: assignNumber(rooms[roomId] ,  players),
      name: player?.name,
      playerId: player?.uid,
      email: player?.email,
    };
    players[socket.id] = playerData;
    rooms[roomId].push(socket.id);
    socket.join(roomId);

    io.to(roomId).emit("player-joined", {
      players: rooms[roomId].map((id) => players[id]),
    });
  });

  socket.on("car-move", ({roomId, distance , x, y }) => {
    
    if (players[socket.id]) {
      players[socket.id].x = x;
      players[socket.id].y = y;

      io.to(roomId).emit("car-update", {
        id: socket.id,
        distance,
        car: players[socket.id],
      });

      
      if (distance >= FINISH_LINE) {
        io.to(roomId).emit("winner", socket.id);
      }
    }
  });

  socket.on("disconnect", () => {
    
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
