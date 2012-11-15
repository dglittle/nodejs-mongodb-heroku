var mongoose = require("mongoose");

//Database
var db = mongoose.connect("mongodb://skory:9210122q+@alex.mongohq.com:10062/app8791457");
var normalSchema = mongoose.Schema({message: "string", timestamp: "date"});
var privateSchema = mongoose.Schema({message: "string", timestamp: "date", 
				     author: "string"});
var Chat = db.model("Chat", normalSchema);
var PChat = db.model("Private", privateSchema);


exports.Chat = Chat;
exports.PChat = PChat;