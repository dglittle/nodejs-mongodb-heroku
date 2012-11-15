


function normalize(str) {
    str = str.toLowerCase();
    // is it faster than regexps? 
    str = str.replace(",", "").replace("?", " ? ").replace("!", " ! ")
	.replace(":", "").replace(":", "").replace("*", " * ")
	.replace("%", " % ");
    str = str.replace("i'm", "i am").replace("'s", "is")
	.replace(" your ", " my ");
    return str;
}

function tokenize(str) {
    str = normalize(str);
    return str.split(/\s+/)
	.map(function (s) { return s.trim(); })
	.filter(function (s) { return s != ""; });
}


// var s = "Hi, my name is [*]! And yours?";
// console.log(tokenize(s));
// s = normalize(s);
// console.log(s);
// s = s.split(/\b/);
// console.log(s);

exports.tokenize = tokenize;