require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth-routes');
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
// get events
app.get('/', async (req, res) => {
	const events = await Event.find({});
	res.send(events);
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000');
});
