/*
Notes: 
'data' is lazily imported from the html
'seedrandom' is also imported from html. it gives deterministic random #s based on a seed set in fire()
*/


var wordsSelected = [];
var teams = [];
var NUMBER_OF_WORDS = 25;
var STARTING_TILES = 9;
var spyMasterMode = false;
var EQUAL_TEAMS = false;
var sessionData = [];
var customData = [];

var COLOR_RED = "redTeam";
var COLOR_YELLOW = "noTeam";
var COLOR_BLUE = "blueTeam";
var COLOR_GREEN = "noTeam";
var COLOR_BLACK = "blackTeam";

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
	for (var i = 0; i < trs.length; i++) {
		document.getElementById("board").innerHTML += '<div class="row">' + trs[i] + '</div>'
	}
	var neutrals = NUMBER_OF_WORDS
	//create teams
	for (var i = 0; i < STARTING_TILES-1; i++) {
		teams.push(COLOR_RED);
		teams.push(COLOR_BLUE);
		neutrals--;
		neutrals--;
	}

	//one extra for one of the teams
	if(!EQUAL_TEAMS){
		if (Math.floor(Math.random() * data.length) % 2 === 0) {
			teams.push(COLOR_RED);
			$('#board').addClass('redStarts').removeClass('blueStarts');
	
		} else {
			teams.push(COLOR_BLUE);
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
		if (!document.getElementById("confirm").checked || window.confirm("Are sure you want to select '" + word + "'?")) {
			document.getElementById(value).className += " "+teams[value];
 		}
	} else {
		//spymaster mode
		document.getElementById(value).className += " "+teams[value];
	}
	
	//update score
	updateScore();
}

function updateScore(){
	var blueScore = STARTING_TILES;
	var redScore = STARTING_TILES;
	$('div.word').each(function() {
		var className = $(this).className;
		if ($(this).hasClass(COLOR_RED)){
			redScore--;
		}
		if ($(this).hasClass(COLOR_BLUE)){
			blueScore--;
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
	for (var i = 0; i < NUMBER_OF_WORDS; i++) {
		document.getElementById(i).className += teams[i];
	}
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
