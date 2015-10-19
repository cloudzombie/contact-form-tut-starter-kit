Meteor.publish("contact-messages", function() {
	return ContactMessages.find({},{});
});