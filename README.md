# contact-form-tut-starter-kit
In this Meteor tutorial we are going a build a simple contact form that we could implement onto any website created with MeteorJS. By the end of it we will have created a contact form, a list of all the messages sent through the contact form in our dashboard(this list will also be able to tell us which messages we have viewed and which ones we haven’t), and a page to view each individual message and send an email reply.

 

Table of Contents

Getting Started
Setting Up Our Application
Building the Contact Form
Adding Functionality to the Form
Adding Messages to the Dashboard
Message Page
 

Getting Started

To get started you will want to download the starter kit for the tutorial. This is done in order to keep the tutorial short and sweet. This will include everything you need in order to jump right into the tutorial. You can download this starter kit here: https://github.com/ipbyrne/contact-form-tut-starter-kit or by typing the following commands into your terminal. 

git clone https://github.com/ipbyrne/contact-form-tut-starter-kit.git
cd contact-form-tut-starter-kit
meteor 
 

This will download the starter-kit, navigate you into the starter-kit directory and get the meteor server up and running. With this done you should now be able to access the application by visiting localhost:3000. By default the application will create 4 accounts. 1 Admin and 3 Members. Log into the admin account using the following credentials in order to be able to view the admin dashboard:

Email: admin@admin.com

Password: password123

NOTE: By default the password to all automatically created accounts is password123

What all is included in the starter kit:

Basic Routing – Iron Router
Automatic Admin Account Creation
Index Page
Dashboard Page – Admin Only
File Structure for the application.
Toastr – Alerts
and a few other things…
 

Setting Up Our Application

Now that we have our starter kit downloaded and our application up and running it is time to start coding. Hooray! In order for our contact form to work we need to first set up our application so that it can store new messages, publish the messages from the data-base, and subscribe to to the published messages from the client side. This is what we are going to knock out now.

 

First lets create our new mongo collection so that messages from the contact form can be stored in our database. In order to do this we will want to navigate to our contact-message.js file inside of our collections folder and add the following code.

 

File: /lib/collections/contact-messages.js

ContactMessages = new Mongo.Collection("contact-messages");
 

All this does is create a mongo collection on our server named contactMessages. Nothing too crazy. Once you have entered this line you can save and close the file.

Next we are going to need to publish this collection from our server in order for us to eventually get the data to render on the client-side of the application. In order to achieve this we will navigate to our publication.js file within our server folder and add the following code.

 

File: /server/publication.js

Meteor.publish("contact-messages", function() {
    return ContactMessages.find({},{});
});
 

This code will take the new collection we just created, and publish all of the data in it from the server. Now that our collection is created and our data is being published, we can subscribe to the data on the client side of the application, making it accessible. Now that our data from the server is being published lets go ahead and subscribe to the data so that we can actually access it. In order to do this we will navigate into our subscription.js file within our client folder and add the following line of code:

 

File: /client/subscription.js

Meteor.subscribe('contact-messages');
 

This code allows the data being published from the server to now be accessed on the client-side of the application. With our collection created, our data being published & subscribed, we have officially finished setting up our application and can now move onto the guts of the tutorial. The next thing we are going to tackle is actually building the contact form.

 

Building the Contact Form

For this tutorial we are just going to build the contact form on the index page of the application to keep it nice and simple. First we are going to open the file named contact-form.html inside the /client/template/layout/ directory. Enter the following code into the file.

File: /client/template/layout/contact-form.html

<template name="contactForm">
        <form>
            <div class="col-sm-6">
                <label>Name</label>
                <input class="form-control" type="text" name="contact-name" id="contact-name"/>
            </div>
            <div class="col-sm-6">
                <label>Email</label>
                <input class="form-control" type="text" name="contact-email" id="contact-email"/>
            </div>
            <div class="col-xs-12">
                <br>
                <label>Message</label>
                <textarea class="form-control" rows="6" name="contact-message" id="contact-message"></textarea>
            </div>
            <div class="col-xs-12 text-right">
                <br>
                <button type="submit" class="btn btn-success">Send</button>
                <br>
                <br>
            </div>
        </form>
    </div>
</template>
This creates a template for the form that we can render anywhere we would like in application. This is just a simple contact form that is using some basic bootstrap stylings to make it not look absolutely horrible. We have made sure to give each input a unique id(contact-name, contact-email, contact-message) which will be used later to grab the values of the inputs when we begin to actually make the form functional. With this template created,  in the home.html page in the /client/template/layout/ directory add the following code under the jumbo-tron div.

 

File: /client/templates/layout/home.html

<template name="home">
    <div class="container">
        ...
       {{> contactForm}}
    </div>
</template>
This single line of code will render the template we just created onto our home page. As I mentioned earlier, thanks to Meteor, we can render this form anywhere we would like in our application by just using the single line of code below:

{{> contactForm}}
This is just one of the many amazing things meteor allows us to do.

 

Adding Functionality to the Form

Now that we have our form created, it is time to add some functionality to the form. We are going to do this by using Meteor events and server methods. We are going to capture the event of the form being submitted on the contactForm template and use that to call the Meteor Method that will create the message from the contact form. First thing we need to do is capture our events on the contactForm template. To do this open the file contact-form.js in the /client/events/layout/ directory and add the following code:

 

File: /client/events/layout/contact-form.js

Template.contactForm.events({
    'submit form':function(e) {
        e.preventDefault();
        var message = {
            name: $('#contact-name').val(),
            email: $('#contact-email').val(),
            message: $('#contact-message').val(),
            submitted: new Date(),
            new: true
        };

        Meteor.call('insertMessage', message, function(error) {
           if(error) {<
             toastr.error('Failed to send message... '+error);
           } else {
             $('#contact-name').val('');
             $('#contact-email').val(''); 
             $('#contact-message').val('');
             toastr.success('Message Sent!');
           }
        });
     }
});
 

Now lets go over all of that so we make sure we understand what is going on. First we are looking for the form to be submited on our conactForm template. If the form is submitted, the first thing we need to do is prevent the default actions that would normally occur. Next we create the message which includes the following values: name(String), email(String), message(String), submitted(Date), and new(Boolean). We use JQuery to grab the value of the inputs for the name, email, and message field on our form by using the special IDs we gave them earlier. We simply use javascript’s new Date() function to create the date and time the message was sent at, and by default we set the value of new to true. This will be used later to display what messages we have not viewed yet in our dashboard.

 

After we have created our message we then user Meteor.call() to call the ‘insertMessage’ method on the server. We then pass the message to the method we are calling and create our call back function. If there is an error calling the method we use toastr.error() to alert the client that there was an error sending their message while specifying what that error was. If there is no error when calling the method we use JQuery again to reset the values of our inputs in the contact form and then we use toastr.success() to alert the client that their message was sent successfully. If we try to submit the form at this point we will still get an error. This is because we have not created the method being called on our server yet. So lets do that next. In our methods.js file in the /server/ directory add the following code.

 

File: /server/methods.js

Meteor.methods({
    insertMessage: function(message) {
        ContactMessages.insert(message);
    }
});
 

First we create the method that is being called on our client and we pass the message with it. Then we simple use the ContactMessages.insert() command with the message being passed to it in order to save the actual message into the database. At this point if you now try and submit the contact form you should get the success message. Hooray!

 

Even though we can now create messages from the contact form and save them to our data base we are still missing something. We are missing the ability as an admin of the application to view the messages sent, send an email reply to them, and delete them from the database. This is what we will focus on tackling next.

 

Adding Messages to the Dashboard

Right now if we visit our admin dashboard all we are able to see is a page with the title Dashboard and that is it. What we want to see here is a list of all the messages submitted through the contact form so that we can eventually read them, reply to them and delete them. Before we are able to display any messages or even interact with them we first need to create some helpers we will be using on this page. To do this we will open our admin-dashboard.js in our /client/helpers/user-management/ directory and add the following code:

 

File: /clients/helpers/user-management/admin-dashboard.js

Template.adminDashboard.helpers({
    messages: function() {
        return ContactMessages.find({},{sort: {submitted: -1}});
    },
    isNew: function() {
        return this.new;
    }
});
 

The first helper we create is our messages helper. This returns the collection of messages sorted by the date they we created and will be used to iterate over each message in the collection. The second helper we create returns the “new” boolean value of each message. This will be used later in the template to notify us which messages are new. Now that we have our helpers created we can actually list out all of the messages in our dashboard.

 

To list out the messages in the dashboard we will open up our admin-dashboard.html in our /clients/templates/user-management/admin-dashboard/ directory and add the following code:

 

File: /clients/templates/user-management/admin-dashboard/admin-dashboard.js

<div class="col-xs-12">
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th width="48"></th>
            </tr>
        </thead>
        <tbody>
            {{#each messages}}
                <tr>
                    <td class="text-left text-middle"><a href="messages/{{id}}" class="open-message">{{name}}{{#if isNew}}<label class="btn btn-sm btn-warning pull-right">New!</label>{{/if}}</a></td>
                    <td><a href="messages/{{id}}" class="open-message">{{email}}</a></td>
                    <td><a href="messages/{{id}}" class="open-message">{{formatDate submitted}}</a></td>
                    <td>
                        <button class="delete-message btn btn-danger"><i class="fa fa-times"></i></button>
                    </td>
                </tr>
            {{/each}}
        </tbody>
    </table>
</div>
 

This will create a table on the dashboard page and a new row will be created for each message being returned by the messages helper we just created. Within each row we use Meteor’s SpaceBars to render the name, email, date and body of each message. .We also use our isNew helper we created in an if statement to check if the new value of the message is true, if it is a label informing us that the post is new will be rendered. Finally we render a button with the class delete-message that we will use later to delete the messages. It is important to notice that each of the messages values are wrapped in link tags with a class of “open-message”, this will be used change the new value to false once we open a message. You should also notice each of the href tags all equal “messages/{{id}}”, this is because we are going to use the ID of the message with Iron Router to give each message their own page. In order for these links to work we need to add the routes to our router.js file in our /lib/ directory. Open up the router.js file and add the following code below the existing code:

 

File: /lib/router.js

Router.route('/messages/:_id', {
    name: 'messagePage',
    layoutTemplate: 'messagePage',
    data: function() {
        return ContactMessages.findOne(this.params._id);
    }
});
 

This creates a route that we can use for each of our messages. We name the route ‘messagePage’, we specify the layout template the route should use which is also ‘messagePage’, and finally we specify the data to be used with the template by returning the message whose id matches the one we clicked. Now if you try and click one of the links you will be taken to the correct route except you will likely get an error saying their is no template named messagePage and this is because we have not created it yet. Before we go onto create it, there are two more thing we must do for the admin-dashboard page and that is configure the helper to allow us to delete messages whenever we click the red button with the x, and to change the new value to false whenever we open a message. To do this we will open the admin-dashboard.js file in the /client/events/user-management/admin-dashboard/ directory and add the following code:

 

File: /client/events/user-management/admin-dashboard/admin-dashboard.js

Template.adminDashboard.events({
    'click button.delete-message':function() {
        if(confirm('Are you sure?')) {
            Meteor.call('deleteMessage', this.id, function(error) {
                if(error) {
                    toastr.error("Failed to delete message... "+error);
                } else {
                    toastr.success("Message Deleted!");
                }
            });
        }
    },
    'click .open-message':function() {
        Meteor.call('openMessage', this._id, function(error) {
                if(error) {
                    toastr.error("Failed to open message... "+error);
                }
            });
    }
});
 

The first event we are listening for is a click on the button with the “delete-message” class. When the button is clicked the user will be prompted with a dialog box to confirm if they want to delete the message. If they confirm they do want to delete the message we will use Meteor.call() to call the ‘deleteMessage’ method and pass it the ID of the message, again followed by a call back that will give us an error or success message depending on if the message is deleted or not. The next event we are listening for is if any of the links with the class ‘open-message’ are clicked. If they are we will use Meteor.call() again to call the method ‘openMessage’ while passing it the ID of the message, again followed by a callback to alert us if their is an error calling the function. As of now neither of these method calls will not work as we have not created either of the methods being called, so lets do that now.

 

Open your methods.js file in your /server/ directory and add the following methods under the ‘insterMessage’ method:

 

File: /server/methods.js

openMessage: function(messageId) {
    ContactMessages.update({_id: messageId}, {$set: {new: false}});
},
deleteMessage: function(messageId) {
    ContactMessages.remove({_id:messageId});
}
 

The first method we create is the ‘openMessage’ method and we again pass in the messageId. We then update the message in the collection and use the mongo operator $set to set the value of new to false. This will remove the new label whenever we view a message. The second method we create is the ‘deleteMessage’ method. We pass the method the messageId and then we use the ID to remove that message from the collection.

 

With that done we have finished all of the code for the adminDashboard template and can move on to the final piece of the puzzle, the messagePage template.

 

Message Page

Its time to finally create the message page template. Inside the /client/templates/user-management/admin-dashboard/ directory create a message-page.html file and inside add the following code:

File: /client/templates/user-management/admin-dashboard/message-page.html

<template name="messagePage">
    <div class="container">
        <div class="col-xs-12">
            <div class="col-sm-6">
                <h3 class="page-header">Message</h3>
                <h3>{{formatDate submitted}}</h3>
                <h3>From: {{name}}</h3>
                <h3>Email: {{email}}</h3>
                <h3>Message:</h3>
                <h5>{{message}}</h5>
            </div>
            <div class="col-sm-6">
                <h3 class="page-header">Reply</h3>
                <h3>To: {{email}}</h3>
                <input class="form-control" type="text" name="reply-subject" id="reply-subject" placeholder="Subject"/>
                <br>
                <textarea class="form-control" name="reply-message" id="reply-message" rows="6"></textarea>
                <br>
                <button class="btn btn-success send-message">Send</button>
            </div>
        </div>
    </div>
</template>
In this template we are using bootstrap to break the page into 2 columns. In the first column we use Meteor’s spacebars to again render each piece of information from our message. We again are using our global helper to format the date. In the second column we have created a simple form where we can create a subject and message to send as an email reply to the original contact message. Keep in mind this form is not yet functional so lets take care of that. To do that we will again need to capture the event of the form being submitted to call a method on the server side which will send out our email. Lets take care of our event first. Inside the /events/user-management/admin-dashboard/ directory create a file name message-page.js and add the following code to it:

 

File:  /events/user-management/admin-dashboard/message-page.js

Template.messagePage.events({
    'click .send-message':function(e) {
        e.preventDefault();
        var to = this.email;
        var from = "info@isaacpbyrne.com"
        var subject = $('#reply-subject').val();
        var message = $('#reply-message').val();

        if(message != '' && subject != '') {
            Meteor.call('sendEmail', to, from, subject, message, function (error) {
                if(error) {
                    toastr.error('Failed to send message... '+error);
                } else {
                    $('#reply-message').val('');
                    $('#reply-subject').val('');
                    toastr.success('Message Sent!');
                }
            });
        } else {
            toastr.error('Your email must contain a subject and a message');
        }
    }
});
 

First we are looking for an element with the class ‘send-message’ to be clicked. Once this is clicked we will create all of the variables we are going to pass into our Meteor Method to send the email(to, from, subject, message) by again using JQuery to get the values of the inputs. Next we make sure our subject and message are not blank, and if this is true we user Meteor.call() to call our ‘sendEmail’ method and we pass in the variables we just created. If the method is called with an error we will be alerted the error thanks to taostr and if the method is called successfully we will alert the user that the email was sent via toastr and then we will reset the values of the form input fields. 

NOTE: You can use any email you would like from the from field but it is encouraged to use an email people can actually reply to.

 

Now that we are capturing the event of our form being submitted, we can move on to the last piece of the puzzle. It’s time to code the ‘sendMessage’ method that is being called by our event. Open your methods.js file inside the /server/ directory and add the following method below the ones that currently exist.

 

File: /server/methods.js

sendEmail: function(to, from, subject, message) {
    check([to, from, subject, message], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: message
    });
}
 

We create the method and we pass in all of the variables being passed from the event(to, from, subject, message). We first check to make sure each of the items are in fact strings, next we use this.unlock() to prevent the client from being locked out of other methods while the email is sent. Next we use the Meteor Email.send() function passing in all of our variables with the appropriate keys in order to actually send the email.

 

Since we are in a development environment Meteor will not actually send an email but instead will print out the email that would have been sent into your terminal. So if everything is working as it should you will see something like the image below appear in your terminal whenever you send your reply. 

 

Screen Shot of Test Email for Meteor Tutorial

 

That’s It!

That is it! We are done. Go ahead a pat yourself on the back because we now have a fully functioning contact form that we can render anywhere we’d like on our website. We can also view all of the message sent through the contact form from our dashboard, reply to the messages and delete them. This is a basic example of how you can use meteor to handle something like this, and with that being said there are many improvements that could be added. Some of these improvement include things like:

Form Validations
Ability to show if you have responded to a message or not.
Increase the complexity of the form(Address, gender, etc).
With that being said, we are officially finished with this tutorial. I hope you enjoyed reading it and found it useful. Please leave any feedback or questions you may have below and keep an eye out for more tutorials coming soon!
