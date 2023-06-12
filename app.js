require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth-routes');
const categoryRoutes = require('./routes/category-routes');
const userRoutes = require('./routes/user-routes');
const schema = require('./models/schema');

const app = express();

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));

//view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//connect mongoose

mongoose.connect(process.env.DATABASE_CONNECTION_STRING);

//DB models
const Event = schema.event;

//Routes
app.use('/', userRoutes);
app.use('/category', categoryRoutes);

// get events
app.get('/', async (req, res) => {
	if (JSON.stringify(req.query) === '{}') {
		try {
			const events = await Event.find({});
			events.sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
			});

			const message = '';

			res.render('index', { events: events, message: message });
		} catch (error) {
			res.json({ messge: error.message });
		}
	} else {
		const query = req.query.search;
		console.log(query);
		const events = await Event.find({});
		events.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		const message = '';

		res.render('index', { events: events, message: message });
	}
});

app.listen(process.env.PORT || 3000 || `0.0.0.0:${PORT}`, () => {
	console.log('Server started on port 3000');
});
