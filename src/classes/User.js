const { createDefaultUser } = require('../util/creators');
const findCurrentChat = require('../util/findCurrentChat');
const findUserByID = require('../util/findUserByID');

function handlerSendedData(req) {
	const json = JSON.parse(req);
	const { type } = json;

	if (type === 'message') {
		this.onMessage(json);
		return;
	}

	if (type === 'messageUser') {
		this.onMessageToUser(json);
	}
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
}

module.exports = User;
