const router = require('express').Router();
const schema = require('../models/schema');

const Event = schema.event;

router.get('/:categoryName', async (req, res) => {
	const categoryName = req.params.categoryName;
	const events = await Event.find({
		tags: { $in: categoryName },
	});

	if (events.length === 0) {
		const message = `Oops! No Event in this 
        ${categoryName} yet. Hopefully you or someone
        else will host it soon. Please check another category`;
		res.render('index', { events: events, message: message });
	} else {
		const message = '';
		res.render('index', { events: events, message: message });
	}
});

module.exports = router;
