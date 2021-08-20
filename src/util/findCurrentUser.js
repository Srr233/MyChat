function findCurrentUser(allUsers, isSocket, userIDOrSocket) {
	const arr = Array.from(allUsers);
	const { length } = arr;

	for (let i = 0; i < length; i += 1) {
		let result;
		if (Array.isArray(arr[i])) {
			result = findCurrentUser(arr[i], isSocket, userIDOrSocket);
			if (result) return result;
		}
		const isIDUser = arr[i].ID === userIDOrSocket;
		const isSocketUser = arr[i].userSocket === userIDOrSocket;

		if (isIDUser || isSocketUser) {
			return arr[i];
		}
	}
	return undefined;
	// const array = Array.from(allUsers);
	// if (isSocket) {
	// 	return array.find((user) => user.userSocket === userIDOrSocket);
	// }
	// return array.find((user) => user.ID === userIDOrSocket);
}
module.exports = findCurrentUser;
