
var matcher = require("./matcher.js");
var tokenizer = require("./tokenizer.js");

var patterns = 
    {
	"who are you?" : ["i'm alice", "i'm sure you know i'm a bot"],
	"are you * bot?" : ["for sure!", "no doubts, i'm a bot. but can't bots be as real as people?"],
	"is anybody here?" : ["hi, i'm alice. and what's you name?"],
	"hi *" : ["hi!", "hi there!", "hi, nice to meet you!"], 
	"hello" : ["hello", "hi there!", "hello, do i know you?"],
	"* my name is [*]" : ["hi #!", "glad to see you, #"],
	"* i am [*]" : ["hi #!", "glad to see you, #"],
	"what is [%] ?" : ["take a look at http://en.wikipedia.org/wiki/#",
			  "google it! www.google.com/search?q=#"],
	"what is [*] ?" : ["why do you want to know what's #?", 
			   "why should i know what is #?"],
	"* how are you?" : ["i'm fine, thanks. and you?", 
			    "not so bad",
			    "well, you know, with all these new things like Siri I feel like and old old lady..."],
	"* how do you do?" : ["i'm fine, thanks. and you?", 
			    "not so bad",],
	"* weather *" : 
	["oh, weather is much better than new iPhone! i hate this little dirty Siri!", 
	 "i'm afraid i can tell nothing about the weather, i'm just computer program"],
	"* !" : ["ok, ok, don't be so emotional. recall that you are talking with unemotional computer"], 
	"* ?" : ["sorry?", "how can you ask such a thing?!", 
		 "not sure, what you are talking about",
		 "you ask hard questions... let's better talk about the weather"],
    };

var freeAnswers = 
    ["please, continue",
     "that's very interesting, go on, please",
     "awesome",
     "can you tell me about it in a bit more detail?",
     "is it a question?"]


function fillAnswer(answer, matchStr) {
    return answer.replace("#", matchStr);
}

function randomElement(arr) {
    var i = Math.floor(Math.random() * arr.length);
    // console.log(i);
    return arr[i];
}

function answer(phrase) {
    var match = null;
    var answers = null;
    for (patStr in patterns) {
	var pat = tokenizer.tokenize(patStr);
	var seq = tokenizer.tokenize(phrase); 
	// console.log("Pat: " + pat + "\nSeq: " + seq);
	match = matcher.findMatch(pat, seq);
	if (match != null) {
	    // console.log(" $$ Match: " + match + "$$");
	    answers = patterns[patStr];
	    break;
	}
    }    
    if (match != null) {
	// console.log(answers);
	var ans = randomElement(answers); 
	return fillAnswer(ans, match.join(' '));
    } else {
	return randomElement(freeAnswers); 
    }
}


function shellChat() {
    console.log("> is there anybody?");
    process.stdout.write("> ");
    process.stdin.resume();
    process.stdin.setEncoding('utf8'); 
    process.stdin.on('data', function (text) {	
	console.log("> " + answer(text));
	process.stdout.write("> ");	
    });
}

if (!module.parent) {
    shellChat();
}

exports.answer = answer; 