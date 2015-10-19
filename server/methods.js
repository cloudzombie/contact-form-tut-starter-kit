Meteor.methods({
	// Admin Dashboard
	getUserCount: function () {
		count = Meteor.users.find().count();
		return count;
	},
	setUserRole: function(userId, role) {
		Meteor.users.update({_id: userId}, {$set: {"profile.role": role}})
	},
	editUser: function(userId, newEmail, oldEmail) {
		Accounts.addEmail(userId, newEmail, false);
		Accounts.removeEmail(userId, oldEmail);
	},
	resetUserPassword: function(userId, email) {
		Accounts.sendResetPasswordEmail(userId, email);
	},
	resetNewUserPassword: function(email) {
		var user = Accounts.findUserByEmail(email);
		var userId = user._id;
		Accounts.sendResetPasswordEmail(userId, email);
	},
	createNewUser: function(user) {
		Accounts.createUser(user);
	},
	deleteUser: function(userId) {
		Meteor.users.remove(userId);
	}
});