var applicationRoot = __dirname;
// IMPORTS
var express = require('express');
var Chat = require('./db.js').Chat;
var PChat = require('./db.js').PChat;
var alice = require('./alice.js');

var app = express();
//Config
app.configure(function(){
    app.set("views", applicationRoot + "/views");
    app.set("view_engine", "ejs");
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.static(applicationRoot + "/public"));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    app.use(express.logger({ format: ':method :url' }));
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});


app.get("/", function(request, response){
    response.redirect("/index.html");
});

app.get("/index.html", function(request, response) {
    var date = request.cookies.date;
    response.cookie('date', date ? date : new Date(), 
		    { expires: new Date(Date.now() + 900000), 
		      httpOnly: true });
    response.render("index.ejs");
});

app.get("/private.html", function(request, response) {
    var date = request.cookies.date;
    response.cookie('date', date ? date : new Date(), 
		    { expires: new Date(Date.now() + 900000), 
		      httpOnly: true });
    response.render("private.ejs");
});

// API
app.post("/api/private/new", function(request, response){
    var message = request.body.message;
    var msg = new PChat({message: message, timestamp: new Date(), 
			 author: "You"});
    // console.log("MESSAGE: " + msg);
    msg.save(function (err) {
	var ans = alice.answer(message);	
	var ansMsg = new PChat({message: ans, timestamp: new Date(), 
				author: "Alice"})
	// console.log("ANSWER: " + ansMsg);
	ansMsg.save(function(err) {
	    response.status(200);
	    response.end();
	});
    });        
});

app.get("/api/private/messages", function(request, response){
    var date = request.cookies.date;
    PChat.find({})
	.where('timestamp')
        .gt(date)
        .select("message timestamp author")
        .exec(function(err, messages){
	    //console.log(messages);
            response.send(messages);
	});
});


app.post("/api/new", function(request, response){
    var message = request.body.message;
    var chat = new Chat({message: message, timestamp: new Date()});
    chat.save(function (err) {
	response.status(200);
	response.end();
    });
});

app.get("/api/messages", function(request, response){
    var date = request.cookies.date;
    Chat.find({})
        .where('timestamp')
        .gt(date)
        .select("message timestamp")
        .exec(function(err, messages){
            response.send(messages);
        });
});

// STARTING SERVER

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
