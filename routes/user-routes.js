const router = require('express').Router();
const schema = require('../models/schema');

const Event = schema.event;

function authenticateUser(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
	} else {
		next();
	}
}

router.get('/profile', authenticateUser, async (req, res) => {
	const currentUser = req.user;
	const events = await Event.find({ organizer: currentUser.id });
	if (events.length > 0) {
		const message = 'Your Events ';
		res.render('profile', {
			message: message,
			title: 'Profile',
			events: events,
			user: currentUser,
		});
	} else {
		const message = '';
		res.render('profile', {
			message: message,
			title: 'Profile',
			events: events,
			user: currentUser,
		});
	}
});

// only authenticated users can create new event
router.get('/create', authenticateUser, (req, res) => {
	res.render('create', { user: req.user.firstName });
});

router.post('/create', async (req, res) => {
	const tags = req.body.tags.split(', ');
	const newEvent = await new Event({
		organizer: req.user.id,
		title: req.body.title,
		description: req.body.description,
		location: req.body.location,
		date: req.body.date,
		time: req.body.time,
		type: req.body.type,
		price: req.body.price,
		tags: tags,
	}).save();

	res.redirect('/');
});

module.exports = router;
