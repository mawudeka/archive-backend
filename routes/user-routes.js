const router = require('express').Router();
const { application } = require('express');
const schema = require('../models/schema');

const Event = schema.event;

function authenticateUser(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
	} else {
		next();
	}
}

router.get('/profile', authenticateUser, (req, res) => {
	const currentUser = req.user;
	res.send(currentUser + '....');
});

// only authenticated users can create new event
router.get('/create', authenticateUser, (req, res) => {
	res.send(`${req.user.firstName}, You can create new event now.`);
});

router.post('/create', async (req, res) => {
	const newEvent = await new Event({
		organizer: req.user.id,
		title: req.body.title,
		description: req.body.description,
		location: req.body.location,
		date: req.body.date,
		time: req.body.time,
		type: req.body.type,
		price: req.body.price,
	}).save();

	res.redirect('/');
});

// user viewing all their events
router.get('/events', async (req, res) => {
	const allEventByUser = await Event.find({ organizer: req.user.id });
	res.send(allEventByUser);
});

module.exports = router;
