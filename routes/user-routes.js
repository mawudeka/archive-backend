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
function authenticateUser(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
	} else {
		next();
	}
}

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
	}).save();

	res.redirect('/profile');
});
module.exports = router;
