function findCurrentUser(allUsers, isSocket, userIDOrSocket) {
	const array = Array.from(allUsers);
	if (isSocket) {
		return array.find((user) => user.userSocket === userIDOrSocket);
	}
	return array.find((user) => user.ID === userIDOrSocket);
}
module.exports = findCurrentUser;
