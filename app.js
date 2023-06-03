require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const session = require('express-session');
const mongoose = require('mongoose');
const schema = require('./models/schema');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

//view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//passport setups
app.use(passport.initialize());
app.use(passport.session());

//connect mongoose
mongoose.connect(process.env.DATABASE_CONNECTION_STRING);

//DB models
const User = schema.user;
const Event = schema.event;

//router routes
app.use('/auth', authRoutes);
app.use('/', userRoutes);

// get events
app.get('/', async (req, res) => {
	const today = new Date();
	const events = await Event.find({});

	const eventsReversed = events.reverse();
	res.render('index', { events: eventsReversed });
});

app.get('/event/:eventID', async (req, res) => {
	const eventID = req.params.eventID;
	const event = await Event.findById(eventID);

	// create event.ejs to render this later
	res.send(event);
});

app.get('/login', (req, res) => {
	res.send('login page');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000');
});
