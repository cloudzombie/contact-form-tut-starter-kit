Template.signUp.events({
	'submit .sign-up-form': function(e) {
		e.preventDefault();
		var userCount = Session.get("user-count");
		console.log(Session.get("user-count"));
		
		if(userCount > 0) {
			var memberUser = {
				email: $('#signup-email').val(),
				password: $('#signup-password').val(),
				profile: {
					role: 'Member'
				}
			};
			
			Accounts.createUser(memberUser, function(error) {
				if(error) {
					toastr.error("Sign Up Failed... " + error);
				} else {
					toastr.success("Signed Up Successfully");
					Router.go('/');
				}
			});
		
		} else {
			var adminUser = {
				email: $('#signup-email').val(),
				password: $('#signup-password').val(),
				profile: {
					role: 'Admin'
				}
			};
			
			Accounts.createUser(adminUser, function(error) {
				if(error) {
					toastr.error("Sign Up Failed... " + error);
				} else {
					toastr.success("Signed Up Successfully");
					Router.go('/');
				}
			});
		}
	}
});