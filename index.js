const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: [
			'http://localhost:9019',
			'http://localhost:3000',
			'https://resilient-quokka-ff7418.netlify.app',
			'https://game-dev-2023.vercel.app',
		],
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

	socket.on('gameSettings', (data) => {
		console.log('gameSettings.list.update', data);

		socket.broadcast.emit('gameSettings.list.update', data);
	})
});

server.listen(4000, () => 'Server is running');