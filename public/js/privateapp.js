//onload handler
$(function(){
	loadMessages();
	$('#form').submit(function(){
		var messageElement = $("#message");
		var message = messageElement.val();
		messageElement.val("");
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

function loadMessages(){
    var jqxhr = $.getJSON("/api/private/messages", function(){})
	.success(function(messages){
	    var container = $("#messages-inner");
	    container.empty();
	    for(var index in messages){
		var obj = messages[index];
		var wrapper = $("<div class='message-wrapper'></div>");
		var authorStr =  Array(5 + 1 - obj.author.length)
		    .join(' ') + obj.author;
		// alert(obj.author + "|" + authorStr);

		var messageName = $("<div class='screen-name' />")
		    .html("[" + new Date(obj.timestamp).format() + "] " 
			  + authorStr + " ");
		var message = $("<div class='message'></div>").html(obj.message);
		wrapper.append(messageName);
		wrapper.append(message);
		container.append(wrapper);	
	    }
	})
	.error(function(){
	    alert("Sorry! There was an errror while loading messages.");
	});
    
}

