const passport = require('passport');

const router = require('express').Router();

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile'],
	})
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect('/profile');
});

router.get('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}

		res.redirect('/');
	});
});

module.exports = router;
