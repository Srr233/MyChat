function transferUsersFromTo(fromChat, toChat) {
	const fromChatCopy = fromChat;
	const { joinedUsers } = fromChat;
	joinedUsers.forEach((user) => {
		toChat.joinedUsers.add(user);
	});
	fromChatCopy.joinedUsers = new Set();
	return true;
}

module.exports = transferUsersFromTo;
