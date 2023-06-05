require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const session = require('express-session');
const authRoutes = require('./routes/auth-routes');
const categoryRoutes = require('./routes/category-routes');
const userRoutes = require('./routes/user-routes');
const schema = require('./models/schema');

const app = express();

//Middlewares
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
const Event = schema.event;

//router routes
app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/category', categoryRoutes);

// get events
app.get('/', async (req, res) => {
	const events = await Event.find({});

	events.sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});

	const message = '';

	res.render('index', { events: events, message: message });
});

app.get('/event/:eventID', async (req, res) => {
	const eventID = req.params.eventID;
	const event = await Event.findById(eventID);

	res.render('events', { event: event, title: event.name });
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/signup', (req, res) => {
	res.redirect('/login');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000');
});
