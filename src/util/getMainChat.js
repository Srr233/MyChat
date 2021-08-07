function getMainChat() {
	return this.chats.values().next().value;
}

module.exports = getMainChat;
