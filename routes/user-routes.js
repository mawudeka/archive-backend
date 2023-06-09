const router = require('express').Router();
const multer = require('multer');
const schema = require('../models/schema');
const path = require('path');

//multer set up
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `public/images/eventimages/`);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

// event schema
const Event = schema.event;

//check if user is authenticated
// function authenticateUser(req, res, next) {
// 	if (!req.user) {
// 		res.redirect('/login');
// 	} else {
// 		next();
// 	}
// }

//Login
router.get('/login', (req, res) => {
	res.render('login');
});

// Signup
router.get('/signup', (req, res) => {
	res.redirect('/login');
});

//User profile
router.get('/profile', async (req, res) => {
	res.redirect('/');
	// const currentUser = req.user;
	// const events = await Event.find({ organizer: currentUser.id });
	// if (events.length > 0) {
	// 	const message = 'Your Events ';
	// 	res.render('profile', {
	// 		message: message,
	// 		title: 'Profile',
	// 		events: events,
	// 		user: currentUser,
	// 	});
	// } else {
	// 	const message = '';
	// 	res.render('profile', {
	// 		message: message,
	// 		title: 'Profile',
	// 		events: events,
	// 		user: currentUser,
	// 	});
	// }
});

// only authenticated users can create new event
router.get('/create', (req, res) => {
	res.render('create', { title: 'Create Event' });
});

router.post('/create', upload.single('file'), async (req, res) => {
	const tags = req.body.tags.split(', ');
	await new Event({
		image: req.file.filename,
		title: req.body.title,
		description: req.body.description,
		location: req.body.location,
		date: req.body.date,
		time: req.body.time,
		type: req.body.type,
		price: req.body.price,
		tags: tags,
		account: {
			name: req.body.account_name,
			number: req.body.account_number,
			bank: req.body.account_bank,
			brank: req.body.account_branch,
		},
	}).save();

	res.redirect('/profile');
});

// Event's details
router.get('/event/:eventID', async (req, res) => {
	const eventID = req.params.eventID;
	const event = await Event.findById(eventID);

	res.render('events', { event: event, title: event.name });
});

// register for event
router.get('/:event/register', async (req, res) => {
	const eventId = req.params.event;
	const event = await Event.findOne({ _id: eventId });
	res.render('registration', { event: event, title: 'Register for event' });
});

// confirm registration

router.get('/confirm', async (req, res) => {
	res.send('confirm');
});

router.post('/:event/register', async (req, res) => {
	const eventId = req.params.event;
	try {
		await Event.updateOne({ _id: eventId }, { $inc: { participants: 1 } });
		const event = await Event.find({ _id: eventId });
		res.json({ message: 'Registration successful', event });
	} catch (error) {
		res.send(error);
	}
});
module.exports = router;
