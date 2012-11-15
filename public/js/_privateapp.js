//onload handler
$(function(){
	loadMessages();
	$('#send').click(function(){
		var messageElement = $("#message");
		var message = messageElement.val();
		postMessage(message, loadMessages);
		return false;
	});
});

function postMessage(message, callback){
	var jqxhr = $.post("/api/private/new", {message: message})
	.success(function(){
		if($.isFunction(callback))
			callback.call(window);
	})
	.error(function(){
		alert("Could not post message");
	});
}

function loadMessages() {
    var jqxhr = $.getJSON("/api/private/messages", function() {})
	.success(function(messages){
	    var container = $("#container");
	    container.empty();
	    for(var index in messages) {
		var obj = messages[index];
		var date = new Date(obj.timestamp);
		container.append($("<div class='message'></div>").html(obj.author + " [" + date.getHours() + ":" + date.getMinutes() + "]: " + obj.message));
	    }
	})
	.error(function(){
	    alert("Sorry! There was an errror during loading messages.");
	});
    
}

