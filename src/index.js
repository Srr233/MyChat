const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const Chat = require('./classes/Chat');
const FormatterData = require('./classes/FormatterData');
const User = require('./classes/User');

const PORT = process.env.PORT || 3000;

const app = express();
app.use((req, res) => {
	res.send('Connected');
});

const server = http.createServer(app);

const serverSocket = new WebSocket.Server({ server });
const chat = new Chat();
const formatterData = new FormatterData(chat);

serverSocket.on('connection', (socket) => {
	const currentUser = new User(socket, chat);
	const mainChat = chat.getMainChat();
	chat.pushUserInCurrChat(mainChat, currentUser);
	chat.updateNewUserForAllUsersInCurrChat(currentUser, mainChat);
	socket.send(formatterData.getForConnectNewChat(currentUser, mainChat));
});

server.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
