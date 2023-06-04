const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const schema = require('../models/schema');
const multer = require('multer');
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


const connection = mongoose.createConnection(
	process.env.DATABASE_CONNECTION_STRING
);
//Initialize gfs
let gfs;

connection.once('open', () => {
	gfs = Grid(connection.db, mongoose.mongo);
	gfs.collection('eventsimages');
});



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

router.post('/create', upload.single('file'), async (req, res) => {
	const image = req.file.filename;

	const tags = req.body.tags.split(', ');
	await new Event({
		organizer: req.user.id,
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

// Display event image
router.get('/event/:eventimage', async (req, res) => {
	const images = await gfs.files.find({});
	res.send(images);
	// const readstream = gfs.createReadStream(image.filename);
	// readstream.pipe(res);
});
module.exports = router;
