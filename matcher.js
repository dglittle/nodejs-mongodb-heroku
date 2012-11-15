
function empty(arr) {
    return arr.length == 0;
}

function clone(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
	result[i] = arr[i];
    }
    return result;
}

function add(arr, element) {
    var result = clone(arr);
    result[result.length] = element;
    return result;
}

function head(arr) {
    return arr[0];
}

function tail(arr) {
    if (empty(arr)) return [];
    var result = [];
    for (var i = 1; i < arr.length; i++) {
	result = add(result, arr[i]);
    }
    return result; 
}


function match(pat, seq, collect, result) {
    // console.log("pat: " + pat + "\nseq: " + seq + "\ncollect: " 
    //  		+ collect + "\nresult: " + result + "\n");
    if (empty(pat) && empty(seq)) return result;    // match found
    else if (empty(pat)) return null; // match not found
    else {
	var p = head(pat);
	var s = head(seq);
	if (p == s) {
	    // console.log(p + " == " + s);
	    var newResult = collect ? add(result, s) : result;
	    // console.log(newResult);
	    return match(tail(pat), tail(seq), collect, newResult);
	} else if (p == "[") {
	    return match(tail(pat), seq, true, result);
	} else if (p == "]") {
	    return match(tail(pat), seq, false, result);
	} else if (p == "%") {
	    var newResult = collect ? add(result, s) : result;
	    // no words for ?
	    var r = match(tail(pat), seq, collect, newResult);
	    if (r != null) return r;
	    // one word for ?
	    r = match(tail(pat), tail(seq), collect, newResult);
	    return r;
	} else if (p == "*") {
	    var newResult = collect ? add(result, s) : result;
	    // no words for *
	    var r = match(tail(pat), seq, collect, newResult);
	    if (r != null) return r;
	    // one word for *
	    r = match(tail(pat), tail(seq), collect, newResult); 
	    if (r != null) return r;
	    // more than 1 word for *
	    if (!empty(seq))
		r = match(pat, tail(seq), collect, newResult);
	    return r; 
	} else {
	    return null;
	}
    }
}


function findMatch(pat, seq) {
    return match(pat, seq, false, []);
}


function test(pat, seq) {
    console.log("==== TEST ====");
    console.log("pattern  : " + pat);
    console.log("sequence : " + seq);
    var result = findMatch(pat, seq);
    if (result != null)
	console.log("Matches: " + result);
    else 
	console.log("Doesn't match");
    console.log("\n");
}


// test(["*", "my", "name", "is", "[", "*", "]"], 
//      ["my", "name", "is", "Tim"]);

// test(["what", "is", "[", "*", "]", "?"], 
//      ["what", "is", "your", "name", "?"]);

// test(["my", "name", "is", "[", "%", "]", "*"], 
//      ["my", "name", "is", "Tim", ".", "what", "is", "yours", "?"]);



exports.findMatch = findMatch;