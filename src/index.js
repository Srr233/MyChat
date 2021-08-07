const WebSocket = require('ws');
const Chat = require('./classes/Chat');
const FormatterData = require('./classes/FormatterData');
const User = require('./classes/User');

const chat = new Chat();
const formatterData = new FormatterData(chat.chats);

const server = new WebSocket.Server({
	port: 8080,
});

server.on('connection', (socket) => {
	const currentUser = new User(socket, chat);
	const mainChat = chat.getMainChat();
	chat.pushUserInCurrChat(mainChat, currentUser);
	chat.updateNewUserForAllUsersInCurrChat(currentUser, mainChat);
	socket.send(formatterData.getForConnectNewChat(currentUser, mainChat));
});
