var midi = require('midi');
var events = require('events');
var emitter = new events.EventEmitter();

var output = new midi.output();
output.openVirtualPort("SoundLoop");
 
var idx = 0;
var notes = [
	11,
	0,
	10,
	8,
	0,
	0,
	3,
	11,
	0,
	10,
	8,
	0,
	0,
	0,
	0
];

var playNote = function(note,durration){
	var goodNotes = [
		41,
		42,
		43,
		44,
		45,
		46,
		47,
		48,
		49,
		50,
		51,
		52,
	];

	var goodNote = goodNotes[note];
	output.sendMessage([144,goodNote,117]);
	setTimeout(function(){
		output.sendMessage([128,goodNote,0]);
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
	notes[idx] = (notes[idx]+1) % 12;
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

