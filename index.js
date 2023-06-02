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

	socket.on('game-dev-webhook-test', (data) => {
		console.log('game-dev-webhook-test', data);

		socket.emit('game-dev-webhook-test-catcher', data);
	})
});

server.listen(4000, () => 'Server is running');