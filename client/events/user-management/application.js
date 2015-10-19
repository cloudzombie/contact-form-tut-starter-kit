Template.body.events({
	'click li.logout': function() {
		Meteor.logout(function(error) {
			if(error) {
				toastr.error("Failed to Log Out... " + error);
			} else {
				toastr.success("Logged Out Successfully");
				Router.go('/');
			}
		})
	}
});