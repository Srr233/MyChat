function getAllUsersOfCurrentChat(currentChat) {
	const currentUsers = [];
	currentChat.joinedUsers.forEach((user) => {
		currentUsers.push({
			ID: user.ID,
			name: user.name,
		});
	});
	return currentUsers;
}

module.exports = getAllUsersOfCurrentChat;
