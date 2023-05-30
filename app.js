const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const schema = require('./schema');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const event = schema.event;
const user = schema.user;
// get events
app
	.route('/')
	.get(async (req, res) => {
		const events = await event.find({});
		res.send(events);
	})

	// create new event
	.post(async (req, res) => {
		const title = req.body.title;
		const description = req.body.description;
		const location = req.body.location;
		const time = req.body.time;
		const type = req.body.type;
		const price = req.body.price;
		await event.create({
			title: title,
			description: description,
			location: location,
			time: time,
			type: type,
			price: price,
		});

		const newEvent = await event.findOne({ title: title });
		res.send(newEvent);
	});

// register new user
app.route('/register').post(async (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const comfirmPassword = req.body.comfirmPassword;

	const existedUsername = await user.exists({ username: username });

	if (existedUsername) {
		return res.status(400).send({ message: 'Username already exists' });
	} else {
		if (password !== comfirmPassword) {
			return res.status(400).send({ message: 'Passwords do not match' });
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			await user.create({
				firstName: firstName,
				lastName: lastName,
				email: email,
				username: username,
				password: hashedPassword,
			});
			res.status(200).send({ message: 'User registered successfully' });
		}
	}
});

// Login User In

app.route('/login').post(async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	if (email === '' && password === '') {
		return res.status(400).send({ message: 'Please fill all fields' });
	} else {
		// check if user exists
		const existedUser = await user.findOne({ email: email });
		if (!existedUser) {
			return res.status(400).send({ message: 'User not found' });
		} else {
			// check if password is correct
			const validPassword = await bcrypt.compare(
				password,
				existedUser.password
			);
			if (!validPassword) {
				return res.status(400).send({ message: 'Invalid password' });
			} else {
				res.status(200).send({ message: 'User logged in successfully' });
			}
		}
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000');
});
