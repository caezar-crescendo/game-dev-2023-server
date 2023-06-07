const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:9019',
		methods: ['GET', 'POST'],
	},
});

io.on("connection", (socket) => {
	console.log(`User Connected: ${socket.id}`);

	socket.on('user.create', (data) => {
		console.log('user.create', data);

		socket.emit('users.list.update', data);
		socket.broadcast.emit('users.list.update', data);
	});

	socket.on('blocks', (data) => {
		console.log('blocks', data);

		socket.broadcast.emit('blocks.list.update', data);
	})
});

server.listen(4000, () => 'Server is running');