const { createChat } = require('../util/creators');
const deleteCurrentUserFromChat = require('../util/deleteCurrentUserFromChat');
const findCurrentChat = require('../util/findCurrentChat');
const findCurrentUser = require('../util/findCurrentUser');
const getMainChat = require('../util/getMainChat');

class Chat {
	constructor() {
		this.chats = [createChat('Main')];
		this._allUsers = new Set();

		this.getMainChat = getMainChat;
		this.deleteCurrentUserFromChat = deleteCurrentUserFromChat;
	}

	createNewChat(name) {
		const server = createChat(name);
		this.chats.push(server);
		return true;
	}

	pushUserInCurrChat(chat, user) {
		const currChat = findCurrentChat(this.chats, chat.ID);
		const currUser = findCurrentUser(this._allUsers, false, user.ID);
		if (currUser) {
			currChat.add(currUser);
			return;
		}
		currChat.joinedUsers.add(user);
	}

	updateNewUserForAllUsersInCurrChat(newUser, chat) {
		const currChat = findCurrentChat(this.chats, chat.ID);
		currChat.joinedUsers.forEach((user) => {
			if (user.ID === newUser.ID) return;
			user.userSocket.send(
				JSON.stringify({
					ID: newUser.ID,
					name: newUser.name,
					type: 'newUser',
				})
			);
		});
	}

	getCurrentChat(chatID) {
		return findCurrentChat(this.chats, chatID);
	}

	getCurrentChatOfUser(currUser) {
		for (let i = 0; i < this.chats.length; i += 1) {
			const user = findCurrentUser(
				this.chats[i].joinedUsers,
				false,
				currUser
			);
			if (user) return this.chats[i];
		}
		return false;
	}

	getCurrentUserOfSocket(socket) {
		for (let i = 0; i < this.chats.length; i += 1) {
			const user = findCurrentUser(
				this.chats[i].joinedUsers,
				true,
				socket
			);
			if (user) return user;
		}
		return false;
	}
}

module.exports = Chat;
