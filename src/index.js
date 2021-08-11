const WebSocket = require('ws');
const express = require('express');
const Chat = require('./classes/Chat');
const FormatterData = require('./classes/FormatterData');
const User = require('./classes/User');

const allowOrigin = 'https://chat-client-nodejs.netlify.app/';
const PORT = process.env.PORT || 8080;
const server = express()
	.use((res) => {
		res.setHeader('Access-Control-Allow-Origin', allowOrigin);
		res.send('Connected');
	})
	.listen(PORT, () => console.log(`Listening on ${PORT}`));

const chat = new Chat();
const formatterData = new FormatterData(chat.chats);

const serverSocket = new WebSocket.Server({ server });

serverSocket.on('connection', (socket) => {
	const currentUser = new User(socket, chat);
	const mainChat = chat.getMainChat();
	chat.pushUserInCurrChat(mainChat, currentUser);
	chat.updateNewUserForAllUsersInCurrChat(currentUser, mainChat);
	socket.send(formatterData.getForConnectNewChat(currentUser, mainChat));
});
