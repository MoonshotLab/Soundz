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
notes= Array.apply(null, new Array(15)).map(Number.prototype.valueOf,0);

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
		[31,33,35,36,38,40,42],
		[36,38,40,42,43,45,47],//5
		[36,38,40,42,43,45,47],
		[40,42,43,45,47,48,50],
		[40,42,43,45,47,48,50],
		[35,36,38,40,42,43,45],
		[31,33,35,36,38,40,42],//10

		// Sampler
		[0,1,2,3,4,5,6],

		// Effects
		[92,93,94,95,96,97],
		[98,99,100,101,102,103],
		[104,105,106,107,108,109],
		[110,111,112,113,114,115]
		//15
	];


var playNote = function(idx,note,durration){

	emitter.emit('playNote',{index:idx});

	var goodNotes = allNotes[idx];

	var goodNote = goodNotes[note];

		// console.log(idx,note,goodNote);

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
		// console.log(note);
		if( note>=0 ){
			playNote(idx,note,noteDurration);
		}

		idx = (idx+1)%notes.length;
	},noteGap);
};

var changeNote = function(idx){
	notes[idx] = (notes[idx]+1) %  allNotes[idx].length;
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
