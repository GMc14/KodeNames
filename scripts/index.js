/*
Notes: 
'data' is lazily imported from the html
'seedrandom' is also imported from html. it gives deterministic random #s based on a seed set in fire()
*/


var wordsSelected = [];
var teams = [];
var NUMBER_OF_WORDS = 25;
var STARTING_SCORE = 9;
var spyMasterMode = false;
var EQUAL_TEAMS = true;
var sessionData = [];
var customData = [];

var COLOR_RED = "#aa3333";
var COLOR_YELLOW = "#eeee33";
var COLOR_BLUE = "#3333aa";
var COLOR_BLACK = "#333333";
var COLOR_GREEN = "#33aa33";

//init
$( "#seed" ).keyup(function() {
  fire();
});

function fire() {
	//get seed and set the seed for randomizer
	var seed = document.getElementById("seed").value;
	Math.seedrandom(seed.toLowerCase());

	var option = $('#gameMode :selected').val();
	switch (option) {
		case '2knouns':
			sessionData = data.slice(0);
			break;
		case 'movies':
			sessionData = movieData.slice(0);
			break;
		case 'custom':
			if(customData.length === 0){
				var customWordList = prompt("Please enter custom word list. The list will be saved until your refresh your browser. (The words MUST be delimanted by spaces). eg: cat dog mouse", "Enter words here");
				customData = customWordList.split(' ');
			}
			sessionData = customData.slice(0);	
			break;
		default:
			sessionData = defaultData.slice(0);
	}

	wordsSelected = [];
	teams = [];
	spyMasterMode = false;
	document.getElementById("board").innerHTML = "";

	//fire new board
	updateScore();
	createNewGame();
}

//not used, but probably useful at some point
function removeItem(array, index) {
	if (index > -1) {
		// console.log("index: " + index + ", word: " + array[index] + " removed.");
		array.splice(index, 1);
	}
}

function createNewGame() {
	var trs = [];
	for (var i = 0; i < NUMBER_OF_WORDS; i++) {
		if (!trs[i % 5]) {
			trs[i % 5] = "";
		}
		var randomNumber = Math.floor(Math.random() * sessionData.length);
		var word = sessionData[randomNumber];
		removeItem(sessionData, randomNumber);
		wordsSelected.push(word);
		trs[i % 5] += "<div class=\"word\" id=\'" + i + "\' onclick=\"clicked(\'" + i + "\')\"><div><a href=\"#\"><span class=\"ada\"></span>" + word + "</a></div></div>";
	}
	//<a href="#"><span class="ada">Washington stimulates economic growth </span>Read me</a>
	for (var i = 0; i < trs.length; i++) {
		document.getElementById("board").innerHTML += '<div class="row">' + trs[i] + '</div>'
	}
	var neutrals = NUMBER_OF_WORDS
	//create teams
	for (var i = 0; i < STARTING_SCORE; i++) {
		teams.push(COLOR_RED);
		teams.push(COLOR_BLUE);
		neutrals--;
		neutrals--;
	}

	// maybe one extra for one of the teams
	
	if (!EQUAL_TEAMS) {
		if (Math.floor(Math.random() * data.length) % 2 === 0) {
			teams.push(COLOR_RED);
			// document.getElementById("team").style.color = COLOR_RED;
			// document.getElementById("team").innerHTML = "RED";
			$('#board').addClass('redStarts').removeClass('blueStarts');
	
		} else {
			teams.push(COLOR_BLUE);
			// document.getElementById("team").style.color = COLOR_BLUE;
			// document.getElementById("team").innerHTML = "BLUE";
			$('#board').addClass('blueStarts').removeClass('redStarts');
		}
		neutrals--;
	}
	// push the assasin
	teams.push(COLOR_BLACK)
	neutrals--;
	
	// add neturals 
	for (var i = 0; i < neutrals; i++) {
		teams.push(COLOR_YELLOW);
	}

	//shuffle teams
	shuffle(teams);

}

function clicked(value) {
	if (!spyMasterMode) {
		//guessers mode
		var word = wordsSelected[value];
	} else {
		//spymaster mode
		document.getElementById(value).style.backgroundColor = COLOR_GREEN;
	}
	
	//update score
	updateScore();
}
function rgb2hex(rgb) {
     if (  rgb.search("rgb") == -1 ) {
          return rgb;
     } else {
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          function hex(x) {
               return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
     }
}
function updateScore(){
	var blueScore = STARTING_SCORE;
	var redScore = STARTING_SCORE;
	$('div.word').each(function() {
		var color = rgb2hex($(this).css('background-color'));
		if (color === COLOR_RED){
			redScore--;
		}
		if (color === COLOR_BLUE){
			blueScore--;
		}
		if (color === COLOR_BLACK){
			$(this).css('color', 'white');
		}
	});
	//subtract 1 for non-starting team
	if (!EQUAL_TEAMS) {
		if($('.redStarts') === 1){
			redScore--;
		} else {
			blueScore--;
		}
	}
	$('#redScore').text(redScore);
	$('#blueScore').text(blueScore);
}

function spyMaster() {
	spyMasterMode = true;
}

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//enable pressing 'Enter' on seed field
document.getElementById('seed').onkeypress = function(e) {
	if (!e) e = window.event;
	var keyCode = e.keyCode || e.which;
	if (keyCode == '13') {
		// Enter pressed
		fire();
		return false;
	}
}
