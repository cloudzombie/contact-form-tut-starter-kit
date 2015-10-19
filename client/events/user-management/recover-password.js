Template.recoverPassword.events({
  'submit form': function(e) {
		e.preventDefault();
		var options = {
			email: $('#forgot-password-email').val()
		};
		Accounts.forgotPassword(options, function(error) {
			if(error) {
				toastr.error("Failed to send Reset Password email " + error);
			} else {
				toastr.success("Password Reset Email Sent!");
				Router.go('/');
			}
		});
	}
});