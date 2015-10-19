Meteor.startup(function () {
	
	if(Meteor.users.find().count() === 0){
		// Generate Fake Admin User
		var admin = {
			email: 'admin@admin.com',
			password: 'password123',
			profile: {
				role: 'Admin'
			}
		}
		Meteor.call("createNewUser", admin);
		// Generate Fake Member User
		// User 1
		var userOne = {
			email: 'member1@member.com',
			password: 'password123',
			profile: {
				role: 'Member'
			}
		}
		Meteor.call("createNewUser", userOne);
		
		// User 2
		var userTwo = {
			email: 'member2@member.com',
			password: 'password123',
			profile: {
				role: 'Member'
			}
		}
		Meteor.call("createNewUser", userTwo);
		
		// User 3
		var userThree = {
			email: 'member3@member.com',
			password: 'password123',
			profile: {
				role: 'Member'
			}
		}
		Meteor.call("createNewUser", userThree);
	}	
});