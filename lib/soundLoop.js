var midi = require('midi');

var output = new midi.output();
output.openVirtualPort("SoundLoop");
 
var idx = 0;
var notes = [
	11,
	null,
	10,
	8,
	null,
	null,
	3,
	11,
	null,
	10,
	8,
	null,
	null,
	null,
	null,
	null,
	null,
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
		var note = notes[idx++];
		console.log(note);
		if( note ){
			playNote(note,noteDurration);
		}
		idx = idx%notes.length;
	},noteGap);
};

var updateNote = function(idx,val){
	notes[idx] = val;
};

exports.start = start;
exports.updateNote = updateNote;
