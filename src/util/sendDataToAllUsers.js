function sendDataToAllUsers(chats, data, currUser) {
	chats.forEach((chat) => {
		Array.from(chat.joinedUsers).forEach((user) => {
			if (currUser) {
				if (user.ID !== currUser.ID) {
					user.userSocket.send(JSON.stringify(data));
				}
				return;
			}
			user.userSocket.send(JSON.stringify(data));
		});
	});
}

module.exports = sendDataToAllUsers;
