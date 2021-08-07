function deleteCurrentUserFromChat(chat, user) {
	const isDeleted = chat.joinedUsers.delete(user);
	if (!isDeleted) throw new Error('problem with deleting current user');
	return true;
}

module.exports = deleteCurrentUserFromChat;
