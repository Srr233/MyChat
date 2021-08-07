const uniqid = require('uniqid');

function createChat(name) {
	return {
		name: name || `Chat-${uniqid()}`,
		ID: uniqid(),
		joinedUsers: new Set(),
		loggs: '',
	};
}

function createDefaultUser() {
	const uniqID = uniqid();
	const user = {
		name: `Guest-${uniqID}`,
		ID: uniqID,
	};
	return user;
}

module.exports = {
	createChat,
	createDefaultUser,
};
