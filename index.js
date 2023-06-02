const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:9010',
    methods: ['GET', 'POST'],
  },
});

let allUsers = [];

io.on('connection', (socket) => {
  console.log(`User connected test123 ${socket.id}`);

  // Write our socket event listeners in here...

  // join room
  socket.on('join_room', (data) => {
    const { username, room, role } = data;
    socket.join(room);

    // listener all users
    if(role === 'player'){
      allUsers.push(
        { 
          id: socket.id,
          username,
          room,
          distance: 0,
          obstacles: 0,
          time: 0,
          status: 'waiting'
        }
      );
    }
    socket.to(room).emit('room_users', allUsers);
    socket.emit('room_users', allUsers);
  });

  // game start
  socket.on('game_start', (data) => {
    const { room, track } = data;
    allUsers = allUsers.map(user => {
      user.distance = 0;
      user.obstacles = 0;
      user.time = 0;
      user.status = 'playing';
      return user;
    });
    socket.emit('room_users', allUsers); // emit to all including admin
    socket.to(room).emit('room_users', allUsers); // emit to players
    socket.to(room).emit('user_start', track);
  });

  // disconnected
  socket.on('disconnect', () => {
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = allUsers.filter((user) => user.id != socket.id);
      socket.to(user.room).emit('room_users', allUsers);
    }
  });
});

server.listen(4000, () => 'Server is running on port 9010');