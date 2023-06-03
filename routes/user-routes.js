const router = require('express').Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const crypto = require('crypto');
const schema = require('../models/schema');
const mongoose = require('mongoose');

const connection = mongoose.createConnection(
	process.env.DATABASE_CONNECTION_STRING
);
//Initialize gfs
let gfs;

connection.once('open', () => {
	gfs = Grid(connection.db, mongoose.mongo);
	gfs.collection('eventsimages');
});

//Set GridFs Storage
const storage = new GridFsStorage({
	url: process.env.DATABASE_CONNECTION_STRING,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'eventsimages',
				};
				resolve(fileInfo);
			});
		});
	},
});

const upload = multer({ storage });

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
		image: image,
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
