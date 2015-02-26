var midi = require('midi');
var events = require('events');
var emitter = new events.EventEmitter();

var output = new midi.output();
output.openVirtualPort("SoundLoop");
 
var idx = 0;
var notes = [
	1,
	4,
	6,
	13,
	5,
	6,
	4,
	8,
	2,
	10,
	12,
	2,
	9,
	7,
	15
];

var playNote = function(note,durration){
	var goodNotes = [
		26,
		31,
		35,
		38,
		43,
		47,

		33,
		38,
		42,
		50,
		55,
		59,
	];

	var allNotes = [

		/*

		12 Steps Chromatic [31,33,35,36,38,40,42,43,45,47,48,50]
		7 Steps Chromatic [31,33,35,36,38,40,42]

		6 Steps Chord [31,36,38,43,48,50] 
		*/

		// Bass Notes
		[24,26,31],

		// Bass Pad
		[24,26,31,36],

		// Bells
		[31,33,35,36,38,40,42],
		[31,33,35,36,38,40,42,43,45,47,48,50],
		[31,33,35,36,38,40,42,43,45,47,48,50],//5
		[31,33,35,36,38,40,42,43,45,47,48,50],
		[31,33,35,36,38,40,42,43,45,47,48,50],
		[31,33,35,36,38,40,42,43,45,47,48,50],
		[31,33,35,36,38,40,42,43,45,47,48,50],
		[31,33,35,36,38,40,42,43,45,47,48,50],//10
		
		// Sampler
		[0,1,2,3,4,5,6],

		// Effects
		[100,101,102,103,104,105,106],
		[107,108,109,110,111,112,113],
		[114,115,116,117,118,119,120],
		[121,122,123,124,125,126,127],
		//15
	];

	var goodNote = goodNotes[note];
	output.sendMessage([144,goodNote + 12 ,117]);
	setTimeout(function(){
		output.sendMessage([128,goodNote + 12,0]);
	},durration);
};

var running = false;
var start = function(noteDurration, noteGap){
	if(running)
		return;
	running = true;
	console.log('start');
	setInterval(function(){
		var note = notes[idx];
		console.log(note);
		if( note ){
			emitter.emit('playNote',{index:idx});
			playNote(note,noteDurration);
		}

		idx = (idx+1)%notes.length;
	},noteGap);
};

var changeNote = function(idx){
	notes[idx] = (notes[idx]+1) %  
};
var getNotes = function(){
	return notes.slice(0);
}

exports.start = start;
exports.changeNote = changeNote;
exports.getNotes = getNotes;
exports.events = function(){
  return emitter;
};

