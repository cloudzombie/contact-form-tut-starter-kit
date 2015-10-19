Template.adminDashboard.events({
	'change [name="userRole"]': function(event) {
		var role = $( event.target ).find( 'option:selected' ).val();
		var userId = this._id

		Meteor.call('setUserRole', userId, role, function(error) {
			if(error) {
				toastr.error("Failed to change role... " + error);
			} else {
				toastr.success("Role Changed Successfully");
			}
		});
	},
	'keyup .search-bar': function() {
		Session.set("user-search-query", $('.search-bar').val());
	},
	'keyup .search-bar2': function() {
		Session.set("article-search-query", $('.search-bar2').val());
	},
	'click button.delete-user': function() {
		if(confirm('Are you sure?')) {
			Meteor.call('deleteUser', this._id)
		}
	},
	'click button.delete-article': function() {
		if(confirm('Are you sure?')) {
			Meteor.call('deleteArticle', this._id)
		}
	},
	'click .load-more':function() {
		usersHandle.loadNextPage();
	},
	'click .load-more2':function() {
		articlesHandle.loadNextPage();
	}
});