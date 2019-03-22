var mongoose = require("mongoose");

//reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new NoteSchema object
var NoteSchema = new Schema({
    title: String,
    body: String
});

// article model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
