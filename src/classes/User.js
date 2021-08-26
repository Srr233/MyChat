const { createDefaultUser, createChat } = require('../util/creators');
const deleteCurrentUserFromChat = require('../util/deleteCurrentUserFromChat');
const findCurrentChat = require('../util/findCurrentChat');
const findUserByID = require('../util/findUserByID');
const getAllUsersOfCurrentChat = require('../util/getAllUsersOfCurrentChat');
const sendDataToAllUsers = require('../util/sendDataToAllUsers');

function handlerSendedData(req) {
	const json = JSON.parse(req);
	const { type } = json;

	if (type === 'message') this.onMessage(json);
	if (type === 'messageUser') this.onMessageToUser(json);
	if (type === 'create') this.onCreateChat(json);
	if (type === 'join') this.onJoinChat(json);
}

class User {
	/**
	 *
	 * @param {WebSocket} socket
	 * @param {Chat} chat
	 */
	constructor(socket, chat) {
		socket.on('message', handlerSendedData.bind(this));
		socket.on('close', this.onClose.bind(this));

		this.chat = chat;
		this.chats = chat.chats;
		this.userSocket = socket;

		const newUserData = createDefaultUser();
		this.ID = newUserData.ID;
		this.name = newUserData.name;
	}

	onClose() {
		const currentUser = this.chat.getCurrentUserOfSocket(this.userSocket);
		const chatOfUser = this.chat.getCurrentChatOfUser(currentUser.ID);
		this.chat.deleteCurrentUserFromChat(chatOfUser, currentUser);

		const arrFrom = Array.from(chatOfUser.joinedUsers);
		const responce = {
			type: 'userLeft',
			chatID: chatOfUser.ID,
			users: arrFrom,
			nameOfUser: currentUser.name,
		};
		const jsonString = JSON.stringify(responce);
		arrFrom.forEach((user) => {
			user.userSocket.send(jsonString);
		});
	}

	onMessage(data) {
		const currentChat = findCurrentChat(this.chats, data.chatID);
		currentChat.loggs.push(`${data.name}: ${data.message}`);
		const arrFrom = Array.from(currentChat.joinedUsers).filter(
			(user) => user.ID !== data.ID
		);
		arrFrom.forEach((user) => user.userSocket.send(JSON.stringify(data)));
	}

	onMessageToUser(data) {
		const { fromID, toID, message } = data;
		const currentUser = findUserByID(toID, this.chats);
		currentUser.userSocket.send(
			JSON.stringify({
				fromID,
				message,
				type: 'messageUser',
			})
		);
	}

	onCreateChat(data) {
		const newChat = createChat(data.chatName, data.password);
		const previousChat = findCurrentChat(this.chats, data.currentChatID);

		newChat.joinedUsers.add(this);
		this.chats.push(newChat);
		deleteCurrentUserFromChat(previousChat, this);
		const dataRespond = {
			ID: newChat.ID,
			chatName: newChat.name,
			userID: this.ID,
			previousChatID: data.currentChatID,
			type: 'create',
		};
		this.userSocket.send(JSON.stringify(dataRespond));
		sendDataToAllUsers(this.chats, dataRespond, this);
	}

	onJoinChat(data) {
		const currChat = findCurrentChat(this.chats, data.chatID);
		const previousChat = findCurrentChat(this.chats, data.currentChatID);

		if (data.password === currChat.password) {
			const users = getAllUsersOfCurrentChat(currChat);
			const dataRespond = {
				users,
				allMessages: currChat.loggs,
				chatID: currChat.ID,
				type: 'join',
			};
			deleteCurrentUserFromChat(previousChat, this);
			const previousChatUsers = getAllUsersOfCurrentChat(previousChat);

			const newUserInChat = JSON.stringify({
				ID: this.ID,
				name: this.name,
				type: 'newUser',
			});
			currChat.joinedUsers.forEach((user) => {
				user.userSocket.send(newUserInChat);
			});
			const userLeftData = JSON.stringify({
				users: previousChatUsers,
				chatID: data.currentChat,
				nameOfUser: this.name,
				type: 'userLeft',
			});
			previousChat.joinedUsers.forEach((user) => {
				user.userSocket.send(userLeftData);
			});

			this.chat.pushUserInCurrChat(currChat, this);
			this.userSocket.send(JSON.stringify(dataRespond));
			return;
		}
		this.userSocket.send(JSON.stringify({ status: 403, type: 'join' }));
	}
}

module.exports = User;
