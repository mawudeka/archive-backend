const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(
	new GoogleStrategy(
		{
			callbackURL: '/auth/google/redirect',
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
		},
		async (accessToken, refreshToken, profile, done) => {
			console.log(profile);
		}
	)
);
