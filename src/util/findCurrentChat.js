/**
 *
 * @param {Array<object>} chats
 * @param {String} chatID
 * @returns Object
 */
function findCurrentChat(chats, chatID) {
	return chats.find((chat) => chat.ID === chatID);
}

module.exports = findCurrentChat;
