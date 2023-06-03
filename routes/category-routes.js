const router = require('express').Router();
const schema = require('../models/schema');

const Event = schema.event;

router.get('/:categoryName', async (req, res) => {
	const categoryName = req.params.categoryName;
	const events = await Event.find({
		tags: { $in: categoryName },
	});

	res.send(events);
});

module.exports = router;
