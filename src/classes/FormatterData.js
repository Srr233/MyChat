const getAllUsersOfCurrentChat = require('../util/getAllUsersOfCurrentChat');
const getMainChat = require('../util/getMainChat');

class FormatterData {
	constructor(allChats) {
		this.chats = allChats;

		this.getMainChat = getMainChat;
		this.getAllUsersOfCurrentChat = getAllUsersOfCurrentChat;
	}

	getAllChatsNameID() {
		const IDs = [];
		this.chats.forEach((chat) => {
			IDs.push({
				chatID: chat.ID,
				name: chat.name,
			});
		});
		return IDs;
	}

	getForConnectNewChat(user, chat) {
		const chatNameIDs = this.getAllChatsNameID();
		const currentUsers = this.getAllUsersOfCurrentChat(chat);
		const loggsOfMain = chat.loggs;
		// показывать остальным пользователя нового
		const responce = {
			chatNames: chatNameIDs,
			users: currentUsers,
			messages: loggsOfMain,
			myName: user.name,
			myID: user.ID,
			chatID: chatNameIDs[0].chatID,
			type: 'connect',
		};

		return JSON.stringify(responce);
	}
}

module.exports = FormatterData;
