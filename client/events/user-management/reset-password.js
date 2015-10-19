Template.resetPassword.events({
	'submit form': function(e) {
		e.preventDefault();
		var oldPassword = $('#old-password').val();
		var newPassword = $('#new-password').val();
		var newPasswordTwo = $('#new-password2').val();
		
		if(newPassword === newPasswordTwo){
			Accounts.changePassword(oldPassword, newPassword, function(error) {
				if(error) {
					toastr.error('Failed to change password...'+ error);
				} else {
					toastr.success('Password Changed Successfully');
					Router.go('/');
				}
			});
		} else {
			toastr.error("Passwords do not match");
		}
	}
});