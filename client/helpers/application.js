// Global Helpers.
Template.registerHelper("isAdmin", function () {
    if(Meteor.user().profile.role === 'Admin') {
			return true;
		} else {
			return false;
		}
});