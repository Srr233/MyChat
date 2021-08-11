function findUserByID(userID, chats) {
	for (let i = 0; i < chats.length; i += 1) {
		for (let j = 0; j < chats[i].joinedUsers.size; j += 1) {
			const user = Array.from(chats[i].joinedUsers)[j];
			if (userID === user.ID) {
				return user;
			}
		}
	}
	return false;
}

module.exports = findUserByID;
