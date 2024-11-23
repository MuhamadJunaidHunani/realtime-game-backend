 
const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors');

const app = express()
const server = http.createServer(app)
const io = new Server(server , {
    cors:{
        origin:'https://arena-play.vercel.app/',
        methods:['GET' , 'POST']
    }
})
app.use(cors({
  origin: 'https://arena-play.vercel.app/',
  methods: ['GET', 'POST']
}));
const players = {};
const FINISH_LINE = 700; 

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);


  players[socket.id] = { x: 0, y: 0, color: getRandomColor() };
  socket.emit('init', players);
  socket.broadcast.emit('new-player', { id: socket.id, car: players[socket.id] });


  socket.on('car-move', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      io.emit('car-update', { id: socket.id, car: players[socket.id] });
      if (players[socket.id].x >= FINISH_LINE) {
        io.emit('winner', socket.id);
      }
    }
  });


  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('player-disconnect', socket.id);
  });
});

function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
}

app.get('/', (req , res)=>{
    res.send('home')
})

server.listen(3001 , ()=>{
    console.log('server is listen on http://localhost:3001'); 
})