Template.signIn.events({
	'submit .sign-in-form': function(e) {
		e.preventDefault();
		var user = $('#signin-username').val();
		var password = $('#signin-password').val();

		Meteor.loginWithPassword(user, password, function(error) {
			if(error) {
				toastr.error("Sign In Failed... " + error);
			} else {
				toastr.success("Signed In Successfully");
				Router.go('/');
			}
		});
	}
});