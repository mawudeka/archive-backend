const mongoose = require('mongoose');

// Connect to the database
const dbConnection = mongoose.connect('mongodb://127.0.0.1:27017/archiveDB');

// User Schema
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	firstName: String,
	lastName: String,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const user = mongoose.model('User', userSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
	organizer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		// required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: String,
	date: {
		type: Date,
		default: Date.now,
	},
	location: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		default: 'online',
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
});

const event = mongoose.model('Event', eventSchema);

module.exports = { user, event };
